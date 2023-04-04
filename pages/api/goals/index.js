import { activityTitle, ACTIVITY_TYPE_ENUM } from "../../../constants";
import { getGoalEndDays } from "../../../helpers/momentHelper";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { GOALS_SCHEMA } from "../../../yup-schema/goals";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    let filteredStatement1 = [
      { assignee_id: userId },
      {
        goal: {
          organization_id: organization_id,
        },
      },
    ];
    let filteredStatement2 = [
      {
        goal: {
          goal_type: "Organization",
          organization_id: organization_id,
        },
      },
    ];

    if (req?.query?.status !== "All") {
      if (req?.query?.status === "Archived") {
        let filter = {
          goal: {
            is_archived: true,
          },
        };
        filteredStatement1.push(filter);
        filteredStatement2.push(filter);
      } else {
        let filter = {
          goal: {
            is_archived: false,
          },
        };
        filteredStatement1.push(filter);
        filteredStatement2.push(filter);
        filteredStatement1.push({
          status: req.query.status,
        });
        filteredStatement2.push({
          status: req.query.status,
        });
      }
    } else {
      let filter = {
        goal: {
          is_archived: false,
        },
      };
      filteredStatement1.push(filter);
      filteredStatement2.push(filter);
    }

    const data = await prisma.goalAssignee.findMany({
      orderBy: {
        modified_date: "asc",
      },
      where: {
        OR: [{ AND: filteredStatement1 }, { AND: filteredStatement2 }],
      },
      include: {
        goal: {
          include: {
            created: {
              select: {
                first_name: true,
                id: true,
              },
            },
            GoalAssignee: {
              include: {
                assignee: {
                  select: {
                    first_name: true,
                    UserDetails: {
                      select: { image: true },
                    },
                  },
                },
              },
            },
          },
        },
        assignee: {
          select: {
            first_name: true,
            UserDetails: {
              select: { image: true },
            },
          },
        },
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Goals Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    try {
      const reqBody = req.body;
      if (reqBody.goals_headers.length > 0) {
        const reqData = reqBody.goals_headers.map(async (header) => {
          let data = {
            created: { connect: { id: userId } },
            goal_title: header.goal_title,
            goal_description: header.goal_description,
            goal_type: reqBody.goal_type,
            status: reqBody.status,
            progress: reqBody.progress ?? 0,
            frequency: reqBody.frequency ?? "daily",
            end_date: getGoalEndDays(reqBody.end_date),
            organization: { connect: { id: organization_id } },
          };

          if (
            reqBody.goal_type === "Individual" ||
            reqBody.goal_type === "Team"
          ) {
            let assigneeData = reqBody.goal_assignee.map((assignee) => {
              return {
                assignee: { connect: { id: assignee } },
                status: "OnTrack",
              };
            });
            let createdBy = {
              assignee: { connect: { id: userId } },
              status: "OnTrack",
            };
            assigneeData.push(createdBy);

            data.GoalAssignee = { create: assigneeData };
          } else {
            let assigneeData = {
              assignee: { connect: { id: userId } },
              status: "OnTrack",
            };

            data.GoalAssignee = { create: assigneeData };
          }
          const goalData = await prisma.goals.create({
            data: data,
          });
          if (reqBody.goal_type === "Individual") {
            reqBody.goal_assignee.forEach(async (assignee) => {
              const { first_name: createdBy } = user;
              let assignedUser = await prisma.user.findUnique({
                where: { id: assignee },
                include: {
                  UserDetails: true,
                },
              });

              let notificationMessage = {
                message: `${createdBy} has assigned you a Goal.`,
                link: `${BASE_URL}goals`,
              };

              await prisma.userNotification.create({
                data: {
                  user: { connect: { id: assignee } },
                  data: notificationMessage,
                  read_at: null,
                  organization: {
                    connect: { id: organization_id },
                  },
                },
              });

              await prisma.userActivity.create({
                data: {
                  user: { connect: { id: assignee } },
                  type: ACTIVITY_TYPE_ENUM.GOAL,
                  title: activityTitle(ACTIVITY_TYPE_ENUM.GOAL, createdBy),
                  description: header.goal_title,
                  link: notificationMessage.link,
                  type_id: goalData.id,
                  organization: {
                    connect: { id: organization_id },
                  },
                },
              });

              await prisma.userActivity.create({
                data: {
                  user: { connect: { id: userId } },
                  type: ACTIVITY_TYPE_ENUM.GOAL,
                  title: activityTitle(
                    ACTIVITY_TYPE_ENUM.GOALGIVEN,
                    assignedUser.first_name
                  ),
                  description: header.goal_title,
                  link: notificationMessage.link,
                  type_id: goalData.id,
                  organization: {
                    connect: { id: organization_id },
                  },
                },
              });

              if (
                assignedUser?.UserDetails &&
                assignedUser?.UserDetails?.notification &&
                assignedUser?.UserDetails?.notification?.length &&
                assignedUser?.UserDetails?.notification.includes("slack") &&
                assignedUser?.UserDetails?.slack_id
              ) {
                let customText = CustomizeSlackMessage({
                  header: "New Goal Recieved",
                  user: createdBy ?? "",
                  link: `${BASE_URL}goals`,
                  by: "Assigneed By",
                  text: header.goal_title,
                  btnText: "View Goal",
                });
                SlackPostMessage({
                  channel: assignedUser.UserDetails.slack_id,
                  text: `${createdBy ?? ""} has assigneed you a goal`,
                  blocks: customText,
                });
              }
            });
          }
        });

        if (reqData && reqData.length > 0) {
          return res.status(200).json({
            status: 200,
            message: "Goals Details Saved Successfully ",
          });
        }
      } else {
        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ status: 404, message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let transactionData = {};
    transactionData = await prisma.$transaction(async (transaction) => {
      const formdata = await transaction.goals.update({
        where: {
          id: reqBody.id,
        },
        data: {
          goal_title: reqBody.goals_headers[0].goal_title,
          goal_description: reqBody.goals_headers[0].goal_description,
        },
      });

      return { formdata };
    });

    if (transactionData && transactionData.formdata) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Goal Updated",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "POST", "PUT"],
    protectedRoute: true,
    schemaObj: GOALS_SCHEMA,
  });

export default functionHandle;

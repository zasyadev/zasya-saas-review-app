import { getGoalEndDays } from "../../../helpers/momentHelper";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { GOALS_SCHEMA } from "../../../yup-schema/goals";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    const data = await prisma.goalAssignee.findMany({
      orderBy: {
        modified_date: "desc",
      },
      where: {
        OR: [
          {
            AND: [
              {
                assignee_id: userId,
              },
              {
                goal: {
                  organization_id: organization_id,
                },
              },
            ],
          },
          {
            AND: [
              {
                goal: {
                  goal_type: "Organization",
                },
              },
              {
                goal: {
                  organization_id: organization_id,
                },
              },
            ],
          },
        ],
      },
      include: {
        goal: {
          include: {
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

          if (reqBody.goal_type === "Individual") {
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
          await prisma.goals.create({
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

              if (
                assignedUser?.UserDetails &&
                assignedUser?.UserDetails?.notification &&
                assignedUser?.UserDetails?.notification?.length &&
                assignedUser?.UserDetails?.notification.includes("slack") &&
                assignedUser.UserDetails.slack_id
              ) {
                let customText = CustomizeSlackMessage({
                  header: "New Goal Recieved",
                  user: createdBy ?? "",
                  link: `${process.env.NEXT_APP_URL}goals`,
                  by: "Assigneed By",
                  text: header.goal_title,
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
            data: reqData,
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
      await transaction.goalsTimeline.create({
        data: {
          user: { connect: { id: userId } },
          goals: { connect: { id: reqBody.id } },
          status: reqBody.status,
          comment: reqBody?.comment ?? "",
        },
      });

      const formdata = await transaction.goals.update({
        where: {
          id: reqBody.id,
        },
        data: {
          goal_title: reqBody.goal_title,
          goal_description: reqBody.goal_description,
          goal_type: reqBody.goal_type,

          end_date: reqBody.end_date,
        },
      });

      return { formdata };
    });

    if (transactionData && transactionData.formdata) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Goals Details Updated",
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

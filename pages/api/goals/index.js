import {
  GOALS_FILTER_STATUS,
  INDIVIDUAL_TYPE,
  ONTRACK_STATUS,
  ORGANIZATION_TYPE,
  TEAM_TYPE,
} from "../../../component/Goals/constants";
import { activityTitle, ACTIVITY_TYPE_ENUM } from "../../../constants";
import { getGoalEndDays } from "../../../helpers/momentHelper";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";
import { GOALS_SCHEMA } from "../../../yup-schema/goals";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) throw BadRequestException("No User found");

  if (req.method === "GET") {
    const { status } = req.query;
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
          goal_type: ORGANIZATION_TYPE,
          organization_id: organization_id,
        },
      },
    ];

    if (status !== GOALS_FILTER_STATUS.ALL) {
      if (status === GOALS_FILTER_STATUS.ARCHIVED) {
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
          status: status,
        });
        filteredStatement2.push({
          status: status,
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

    if (!data) throw BadRequestException("No Record Found");

    return res.status(200).json({
      data: data,
      message: "Goals Details Retrieved",
    });
  } else if (req.method === "POST") {
    try {
      const reqBody = req.body;
      if (!reqBody.goals_headers.length)
        throw BadRequestException("Bad request");

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
          reqBody.goal_type === INDIVIDUAL_TYPE ||
          reqBody.goal_type === TEAM_TYPE
        ) {
          let assigneeData = reqBody.goal_assignee.map((assignee) => {
            return {
              assignee: { connect: { id: assignee } },
              status: ONTRACK_STATUS,
            };
          });
          let createdBy = {
            assignee: { connect: { id: userId } },
            status: ONTRACK_STATUS,
          };
          assigneeData.push(createdBy);

          data.GoalAssignee = { create: assigneeData };
        } else {
          let assigneeData = {
            assignee: { connect: { id: userId } },
            status: ONTRACK_STATUS,
          };

          data.GoalAssignee = { create: assigneeData };
        }
        const goalData = await prisma.goals.create({
          data: data,
        });
        if (reqBody.goal_type === INDIVIDUAL_TYPE) {
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
          message: "Goals Details Saved Successfully ",
        });
      }
    } catch (error) {
      throw BadRequestException("Internal server error");
    }
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    const data = await prisma.goals.update({
      where: {
        id: reqBody.id,
      },
      data: {
        goal_title: reqBody.goals_headers[0].goal_title,
        goal_description: reqBody.goals_headers[0].goal_description,
      },
    });

    if (!data) throw BadRequestException("Goal not updated");

    return res.status(200).json({
      data: data,
      message: "Goal Updated",
    });
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

import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { MEETING_SCHEMA } from "../../../yup-schema/meeting";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    const data = await prisma.meetings.findMany({
      orderBy: {
        modified_date: "desc",
      },
      where: {
        created_by: userId,
        organization_id: organization_id,
      },
      include: {
        review: {
          select: {
            ReviewAssignee: true,
            created_by: true,
            review_name: true,
            created_date: true,
          },
        },
        goal: {
          select: {
            GoalAssignee: true,
            goal_title: true,
            end_date: true,
          },
        },
      },
    });
    let filterData = [];
    let filterList = [];
    if (Number(data?.length) > 0)
      filterList = data.map((item) => {
        if (item?.meeting_type === "Goal") {
          filterData = item?.goal?.GoalAssignee.map((i) => {
            return i.assignee_id;
          });
        }
        if (item?.meeting_type === "Review") {
          let list = [];
          list = item?.review?.ReviewAssignee.map((i) => {
            return i.assigned_to_id;
          });
          list.push(item?.review?.created_by);
          filterData = list;
        }

        return {
          ...item,
          assigneeList: filterData,
        };
      });

    if (filterList) {
      return res.status(200).json({
        status: 200,
        data: filterList,
        message: "Meetings Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    try {
      const reqBody = req.body;
      let data = {
        created: { connect: { id: userId } },
        meeting_title: reqBody.meeting_title,
        meeting_description: reqBody?.meeting_description ?? "",
        meeting_type: reqBody.meeting_type,
        frequency: reqBody?.frequency ?? "Once",
        meeting_at: reqBody.meeting_at,
        organization: { connect: { id: organization_id } },
      };
      if (reqBody?.type_id) {
        if (reqBody.meeting_type === "Goal") {
          data.goal = { connect: { id: reqBody?.type_id } };
        } else if (reqBody.meeting_type === "Review") {
          data.review = { connect: { id: reqBody?.type_id } };
        }
      }

      let assigneeData = [];
      if (Number(reqBody?.assigneeList?.length) > 0) {
        assigneeData = reqBody?.assigneeList.map((assignee) => {
          return { assignee: { connect: { id: assignee } }, comment: "" };
        });
      }

      if (Number(assigneeData?.length) > 0) {
        data.MeetingAssignee = { create: assigneeData };
      }

      const createData = await prisma.meetings.create({
        data: data,
      });
      if (createData?.id) {
        const meetingData = await prisma.meetings.findUnique({
          where: { id: createData.id },
          include: {
            MeetingAssignee: true,
          },
        });

        if (Number(meetingData?.MeetingAssignee.length) > 0) {
          meetingData.MeetingAssignee.filter(
            (item) => item.assignee_id !== userId
          ).forEach(async (assignee) => {
            const { first_name: createdBy } = user;

            let assignedUser = await prisma.user.findUnique({
              where: { id: assignee.assignee_id },
              include: {
                UserDetails: true,
              },
            });

            let notificationMessage = {
              message: `${createdBy} has scheduled a meeting with you.`,
              link: `${process.env.NEXT_APP_URL}meetings`,
            };

            await prisma.userNotification.create({
              data: {
                user: { connect: { id: assignee.assignee_id } },
                data: notificationMessage,
                read_at: null,
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
                header: "New Meeting Scheduled",
                user: createdBy ?? "",
                link: `${process.env.NEXT_APP_URL}meetings`,
                by: "Assigneed By",
                text: reqBody.meeting_title,
              });
              SlackPostMessage({
                channel: assignedUser.UserDetails.slack_id,
                text: `${createdBy ?? ""} has assigneed you a goal`,
                blocks: customText,
              });
            }
          });
        }
      }

      if (createData) {
        return res.status(200).json({
          status: 200,
          message: "Meeting Details Saved Successfully",
        });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ status: 404, message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    const data = await prisma.meetings.update({
      where: {
        id: reqBody.id,
      },
      data: {
        meeting_title: reqBody.meeting_title,
        meeting_description: reqBody?.meeting_description ?? "",
        meeting_at: reqBody.meeting_at,
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meeting Details Updated",
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
    schemaObj: MEETING_SCHEMA,
  });

export default functionHandle;

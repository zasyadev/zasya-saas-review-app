import moment from "moment";
import { CreateGoogleCalenderApi } from "../../../helpers/googleHelper";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { MEETING_SCHEMA } from "../../../yup-schema/meeting";

const GOAL_TYPE = "Goal";
const REVIEW_TYPE = "Review";
const CASUAL_TYPE = "Casual";

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
        AND: [
          { organization_id: organization_id },
          {
            MeetingAssignee: {
              some: { assignee_id: userId },
            },
          },
        ],
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
        MeetingAssignee: true,
      },
    });
    // let filterData = [];
    // let filterList = [];
    // if (Number(data?.length) > 0)
    //   filterList = data.map((item) => {
    //     if (item?.meeting_type === "Goal") {
    //       filterData = item?.goal?.GoalAssignee.map((i) => {
    //         return i.assignee_id;
    //       });
    //     }
    //     if (item?.meeting_type === "Review") {
    //       let list = [];
    //       list = item?.review?.ReviewAssignee.map((i) => {
    //         return i.assigned_to_id;
    //       });
    //       list.push(item?.review?.created_by);
    //       filterData = list;
    //     }

    //     return {
    //       ...item,
    //       assigneeList: filterData,
    //     };
    //   });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meetings Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    try {
      const reqBody = req.body;

      if ((reqBody.meeting_type = CASUAL_TYPE)) {
        reqBody.type_id = [CASUAL_TYPE];
      }

      if (Number(reqBody?.type_id?.length > 0)) {
        const resData = reqBody.type_id.map(async (item) => {
          let data = {
            created: { connect: { id: userId } },
            meeting_title: reqBody.meeting_title,
            meeting_description: reqBody?.meeting_description ?? "",
            meeting_type: reqBody.meeting_type,
            frequency: reqBody?.frequency ?? "Once",
            meeting_at: reqBody.meeting_at,
            organization: { connect: { id: organization_id } },
          };
          if (reqBody.meeting_type === GOAL_TYPE) {
            data.goal = { connect: { id: item } };
          } else if (reqBody.meeting_type === REVIEW_TYPE) {
            data.review = { connect: { id: item } };
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
                MeetingAssignee: {
                  include: {
                    assignee: {
                      select: {
                        email: true,
                      },
                    },
                  },
                },
              },
            });

            if (Number(meetingData?.MeetingAssignee.length) > 0) {
              const emailsList = meetingData?.MeetingAssignee.map((meeting) => {
                return {
                  email: meeting.assignee.email,
                };
              });
              const meeetingStartTime = moment(meetingData.meeting_at).format();
              const meeetingEndTime = moment(meeetingStartTime)
                .add("30", "minutes")
                .format();

              CreateGoogleCalenderApi({
                emailsList: emailsList,
                meeetingStartTime: meeetingStartTime,
                meetingTitle: meetingData.meeting_title,
                meeetingEndTime: meeetingEndTime,
              });

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
        });
        if (resData && resData.length) {
          return res.status(200).json({
            status: 200,
            message: "Meeting Details Saved Successfully",
          });
        }
      } else {
        return res
          .status(404)
          .json({ status: 404, message: "No Meeting Type Found" });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ status: 404, message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    const meetingData = await prisma.meetings.findUnique({
      where: {
        id: reqBody.id,
      },
      include: {
        MeetingAssignee: true,
      },
    });

    meetingData.MeetingAssignee.forEach(async (assignee) => {
      const meetingAssigneeData = await prisma.meetingAssignee.findMany({
        where: {
          AND: [
            { meeting_id: reqBody.id },
            { assignee_id: assignee.assignee_id },
          ],
          NOT: {
            assignee_id: meetingData.created_by,
          },
        },
      });

      meetingAssigneeData.forEach(async (assignee) => {
        await prisma.meetingAssignee.delete({
          where: {
            id: assignee.id,
          },
        });
      });
    });

    const assigneeData = reqBody?.members.map((assignee) => {
      return { assignee: { connect: { id: assignee } }, comment: "" };
    });

    const data = await prisma.meetings.update({
      where: {
        id: reqBody.id,
      },
      data: {
        meeting_title: reqBody.meeting_title,
        meeting_description: reqBody?.meeting_description ?? "",
        meeting_at: reqBody.meeting_at,
        MeetingAssignee: { create: assigneeData },
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

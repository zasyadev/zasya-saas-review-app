import moment from "moment";
import { activityTitle, ACTIVITY_TYPE_ENUM } from "../../../constants";
import {
  CreateGoogleCalenderApi,
  updateGoogleCalenderApi,
} from "../../../helpers/googleHelper";
import { halfHourEndTime } from "../../../helpers/momentHelper";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { MEETING_SCHEMA } from "../../../yup-schema/meeting";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";

const TYPE = {
  GOAL: "Goal",
  REVIEW: "Review",
  CASUAL: "Casual",
};

const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) throw new BadRequestException("No user found");

  if (req.method === "GET") {
    const { filterId } = req.query;

    let flterCondition = [{ organization_id: organization_id }];

    if (filterId && filterId !== "ALL") {
      flterCondition.push(
        {
          MeetingAssignee: {
            some: { assignee_id: filterId },
          },
        },
        { created_by: userId }
      );
    } else {
      flterCondition.push({
        MeetingAssignee: {
          some: { assignee_id: userId },
        },
      });
    }

    const data = await prisma.meetings.findMany({
      orderBy: {
        meeting_at: "asc",
      },
      where: {
        AND: flterCondition,
      },
      include: {
        MeetingAssignee: true,
      },
    });

    if (!data) throw new BadRequestException("No record found");

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Meetings details retrieved",
    });
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
        generated_by: "User",
        organization: { connect: { id: organization_id } },
      };
      let meetingTypeData = [];
      if (reqBody.meeting_type !== TYPE.CASUAL) {
        meetingTypeData = reqBody.type_id.map((item) => {
          if (reqBody.meeting_type === TYPE.GOAL) {
            return { goal: { connect: { id: item } } };
          } else if (reqBody.meeting_type === TYPE.REVIEW) {
            return { review: { connect: { id: item } } };
          }
        });
      }

      if (Number(meetingTypeData?.length) > 0) {
        data.MeetingType = { create: meetingTypeData };
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
          const meeetingEndTime = halfHourEndTime(meeetingStartTime);

          const event = await CreateGoogleCalenderApi({
            emailsList: emailsList,
            meeetingStartTime: meeetingStartTime,
            meetingTitle: meetingData.meeting_title,
            meeetingEndTime: meeetingEndTime,
          });

          if (event && event.id) {
            await prisma.meetings.update({
              where: {
                id: createData.id,
              },
              data: {
                google_event_id: event.id,
              },
            });
          }

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
              link: `${BASE_URL}followups`,
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

            let activityData = {
              type: ACTIVITY_TYPE_ENUM.FOLLOWUP,
              description: meetingData.meeting_title,
              link: notificationMessage.link,
              type_id: createData.id,
              organization_id: organization_id,
            };

            await prisma.userActivity.createMany({
              data: [
                {
                  ...activityData,
                  user_id: assignee.assignee_id,
                  title: activityTitle(ACTIVITY_TYPE_ENUM.FOLLOWUP, createdBy),
                },
                {
                  ...activityData,
                  user_id: userId,
                  title: activityTitle(
                    ACTIVITY_TYPE_ENUM.FOLLOWUPGIVEN,
                    assignedUser.first_name
                  ),
                },
              ],
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
                link: `${BASE_URL}followups`,
                by: "Assigneed By",
                text: reqBody.meeting_title,
                btnText: "View Follow Up",
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

      if (!createData) throw new BadRequestException("Record not saved");

      return res.status(200).json({
        status: 200,
        message: "Meeting Details Saved Successfully",
      });
    } catch (error) {
      throw new BadRequestException("Record not saved");
    }
  } else if (req.method === "PUT") {
    try {
      const reqBody = req.body;

      const meetingData = await prisma.meetings.findUnique({
        where: {
          id: reqBody.id,
        },
        include: {
          MeetingAssignee: true,
          MeetingType: true,
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
      meetingData.MeetingType.forEach(async (assignee) => {
        await prisma.meetingType.delete({
          where: {
            id: assignee.id,
          },
        });
      });

      let meetingTypeData = [];
      if (meetingData.meeting_type !== TYPE.CASUAL) {
        meetingTypeData = reqBody.type_id.map((item) => {
          if (meetingData.meeting_type === TYPE.GOAL) {
            return { goal: { connect: { id: item } } };
          } else if (meetingData.meeting_type === TYPE.REVIEW) {
            return { review: { connect: { id: item } } };
          }
        });
      }

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
          MeetingType: { create: meetingTypeData },
        },
      });

      if (data.id) {
        const meetingData = await prisma.meetings.findUnique({
          where: { id: data.id },
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

        if (
          Number(meetingData?.MeetingAssignee.length) > 0 &&
          meetingData.google_event_id
        ) {
          const emailsList = meetingData?.MeetingAssignee.map((meeting) => {
            return {
              email: meeting.assignee.email,
            };
          });
          const meeetingStartTime = moment(meetingData.meeting_at).format();
          const meeetingEndTime = halfHourEndTime(meeetingStartTime);

          await updateGoogleCalenderApi({
            emailsList: emailsList,
            meeetingStartTime: meeetingStartTime,
            meetingTitle: meetingData.meeting_title,
            meeetingEndTime: meeetingEndTime,
            eventId: meetingData.google_event_id,
          });
        }
      }

      if (!data) throw new BadRequestException("Record not updated");

      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meeting Details Updated",
      });
    } catch (error) {
      throw new BadRequestException("Record not updated");
    }
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

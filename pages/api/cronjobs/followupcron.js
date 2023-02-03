const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import { CreateGoogleCalenderApi } from "../../../helpers/googleHelper";
import {
  getNextMeetingDate,
  halfHourEndTime,
} from "../../../helpers/momentHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

const meetingCreateHandle = async ({ goalItem, meetingAt }) => {
  let data = {
    created: { connect: { id: goalItem.created_by } },
    meeting_title: goalItem.goal_title,
    meeting_description: goalItem?.goal_description ?? "",
    meeting_type: "Goal",
    frequency: "Once",
    meeting_at: meetingAt,
    organization: { connect: { id: goalItem.organization_id } },
    goal: { connect: { id: goalItem.id } },
  };

  let assigneeData = [];
  if (Number(goalItem?.GoalAssignee?.length) > 0) {
    assigneeData = goalItem?.GoalAssignee.map((assignee) => {
      return {
        assignee: { connect: { id: assignee.assignee_id } },
        comment: "",
      };
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
    }
  }
};

async function handle(req, res) {
  if (req.method != "POST") {
    return res.status(401).json({
      status: 404,
      message: "Method not allowed",
    });
  }

  const { password } = req.body;

  if (password != process.env.NEXT_APP_CRON_PASSWORD) {
    return res.status(401).json({
      message: "Wrong Password",
      status: 401,
    });
  }

  const goalData = await prisma.goals.findMany({
    where: {
      AND: [
        { end_date: { gt: moment().format() } },
        { is_archived: false },
        { frequency: "halfyearly" },
        { goal_type: "Individual" },
      ],
    },
    include: {
      GoalAssignee: {
        where: {
          status: "OnTrack",
        },
        include: {
          assignee: {
            select: {
              first_name: true,
              UserDetails: true,
            },
          },
        },
      },
      Meetings: {
        orderBy: {
          created_date: "desc",
        },
        take: 1,
      },
    },
  });

  if (goalData.length > 0) {
    goalData.forEach(async (item) => {
      if (item.Meetings.length === 0) {
        let meetingAt = getNextMeetingDate(item.created_date);

        meetingCreateHandle({
          goalItem: item,
          meetingAt: meetingAt,
        });
      } else if (item.Meetings.length > 0) {
        const lastMeetingDate = moment().isAfter(item.Meetings[0].meeting_at);
        if (lastMeetingDate) {
          let meetingAt = getNextMeetingDate(item.Meetings[0].meeting_at);
          meetingCreateHandle({
            goalItem: item,
            meetingAt: meetingAt,
          });
        }
      }
    });
  }

  prisma.$disconnect();

  return res.status(201).json({
    message: " Success",
    status: 200,
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: false,
  });

export default functionHandle;

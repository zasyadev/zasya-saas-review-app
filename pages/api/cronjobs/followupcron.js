const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import { CreateGoogleCalenderApi } from "../../../helpers/googleHelper";
import {
  getNextMeetingDate,
  halfHourEndTime,
} from "../../../helpers/momentHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const meetingCreateHandle = async ({ goalItem, meetingAt }) => {
  try {
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

    const emailsList = await goalItem?.GoalAssignee.map((assignee) => {
      return {
        email: assignee.assignee.email,
      };
    });

    if (Number(emailsList.length) > 0) {
      const meeetingStartTime = moment(meetingAt).format();
      const meeetingEndTime = halfHourEndTime(meeetingStartTime);

      const event = await CreateGoogleCalenderApi({
        emailsList: emailsList,
        meeetingStartTime: meeetingStartTime,
        meetingTitle: goalItem.goal_title,
        meeetingEndTime: meeetingEndTime,
      });

      if (event && event.id) {
        data.google_event_id = event.id;
        const createData = await prisma.meetings.create({
          data: data,
        });

        return createData;
      }
    }
  } catch (error) {
    console.error(error);
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
    orderBy: {
      created_date: "desc",
    },
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
              email: true,
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

  function groupArray(arr, parts) {
    let result = [];

    for (let i = 0; i < arr.length; i += parts) {
      result.push(arr.slice(i, i + parts));
    }
    return result;
  }

  const groupedArray = groupArray(goalData, 10);

  if (groupedArray.length > 0) {
    groupedArray.reduce(async (acc, goal, i) => {
      await acc;
      goal.reduce(async (prev, item, index) => {
        await prev;
        if (item?.Meetings?.length === 0) {
          let meetingAt = getNextMeetingDate(item.created_date, index);

          meetingAt = moment(meetingAt).subtract(i, "days").format();

          let checkIsAfterDate = moment().isAfter(meetingAt);

          if (!checkIsAfterDate) {
            meetingCreateHandle({
              goalItem: item,
              meetingAt: meetingAt,
            });
          } else {
            let newMeetingAt = getNextMeetingDate(meetingAt, index);

            meetingCreateHandle({
              goalItem: item,
              meetingAt: newMeetingAt,
            });
          }
        } else if (item?.Meetings?.length > 0) {
          const lastMeetingDate = moment().isAfter(item.Meetings[0].meeting_at);
          if (lastMeetingDate) {
            let meetingAt = getNextMeetingDate(item.Meetings[0].meeting_at);

            meetingCreateHandle({
              goalItem: item,
              meetingAt: meetingAt,
            });
          }
        }

        await wait(2000);
      }, Promise.resolve());
      await wait(5000);
    }, Promise.resolve());
  }

  prisma.$disconnect();

  return res.status(201).json({
    message: "Success",
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

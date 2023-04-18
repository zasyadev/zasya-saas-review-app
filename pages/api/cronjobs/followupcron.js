const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { GOAL_TYPE } from "../../../component/Meetings/constants";
import { ADMIN_ROLE, MANAGER_ROLE, MEMBER_ROLE } from "../../../constants";
import { CreateGoogleCalenderApi } from "../../../helpers/googleHelper";
import {
  getCronNextMeetingDate,
  minutesAddInTime,
} from "../../../helpers/momentHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function existingMeeting({ meeetingTime, organizationId }) {
  let time = meeetingTime;

  const meeting = await prisma.meetings.findMany({
    where: {
      AND: [
        {
          meeting_at: time,
        },
        { organization_id: organizationId },
      ],
    },
  });

  if (meeting.length <= 0) return time;

  time = await minutesAddInTime(time, 20);
  return await existingMeeting({
    meeetingTime: time,
    organizationId: organizationId,
  });
}

const meetingCreateHandle = async (data) => {
  try {
    let emailsList = [];
    let assigneeData = data?.assigneeList.map((assignee) => {
      emailsList.push({ email: assignee.email });
      return {
        assignee: { connect: { id: assignee.id } },
        comment: "",
      };
    });

    if (assigneeData?.length > 0) {
      data.MeetingAssignee = { create: assigneeData };
    }

    if (emailsList.length > 0) {
      const meeetingStartTime = data.meeting_at;
      const meeetingEndTime = await minutesAddInTime(meeetingStartTime, 20);

      const event = await CreateGoogleCalenderApi({
        emailsList: emailsList,
        meeetingStartTime: meeetingStartTime,
        meetingTitle: data.meeting_title,
        meeetingEndTime: meeetingEndTime,
      });
      if (event && event.id) {
        data.google_event_id = event.id;
        delete data.assigneeList;

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
  if (req.method != "POST") throw BadRequestException("Method not allowed");

  const { password } = req.body;

  if (password != process.env.NEXT_APP_CRON_PASSWORD)
    throw BadRequestException("Wrong Password");

  const userOrgData = await prisma.userOrganization.findMany({
    include: {
      UserOraganizationGroups: {
        where: {
          user: {
            status: 1,
          },
        },
        include: {
          user: {
            select: {
              first_name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (userOrgData.length > 0) {
    userOrgData.reduce(async (previous, organization) => {
      await previous;
      const adminData = organization.UserOraganizationGroups.find(
        (item) => item.role_id === ADMIN_ROLE
      );
      organization.UserOraganizationGroups.filter(
        (item) => item.role_id === MEMBER_ROLE || item.role_id === MANAGER_ROLE
      ).reduce(async (prev, user, index) => {
        await prev;
        if (adminData && adminData.user_id) {
          const assigneeList = [
            {
              id: user.user_id,
              email: user.user.email,
            },
            {
              id: adminData.user_id,
              email: adminData.user.email,
            },
          ];

          const meetingDate = await getCronNextMeetingDate(index);

          const meetingAtDate = await existingMeeting({
            meeetingTime: meetingDate,
            organizationId: adminData.organization_id,
          });

          const data = {
            created: { connect: { id: adminData.user_id } },
            meeting_title: `${user.user.first_name} monthly follow up meeting`,
            meeting_description: `${user.user.first_name} monthly follow up meeting`,
            meeting_type: GOAL_TYPE,
            frequency: "Once",
            meeting_at: meetingAtDate,
            generated_by: "System",
            organization: { connect: { id: adminData.organization_id } },
            assigneeList: assigneeList,
          };

          await meetingCreateHandle(data);
        }
        await wait(2000);
      }, Promise.resolve());
      await wait(1000);
    }, Promise.resolve());
  }
  prisma.$disconnect();

  return res.status(201).json({
    message: "Success",
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

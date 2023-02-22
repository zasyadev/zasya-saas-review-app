const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { GOAL_TYPE } from "../../../component/Meetings/constants";
import { ADMIN_ROLE, MANAGER_ROLE, MEMBER_ROLE } from "../../../constants";
import { CreateGoogleCalenderApi } from "../../../helpers/googleHelper";
import {
  getCronNextMeetingDate,
  minutesAddInTime,
} from "../../../helpers/momentHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

    if (Number(assigneeData?.length) > 0) {
      data.MeetingAssignee = { create: assigneeData };
    }

    if (Number(emailsList.length) > 0) {
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

          let data = {
            created: { connect: { id: adminData.user_id } },
            meeting_title: `${user.user.first_name} monthly follow up meeting`,
            meeting_description: `${user.user.first_name} monthly follow up meeting`,
            meeting_type: GOAL_TYPE,
            frequency: "Once",
            meeting_at: meetingDate,
            generated_by: "System",
            organization: { connect: { id: adminData.organization_id } },
            assigneeList: assigneeList,
          };

          await meetingCreateHandle(data);
        }

        // const userGoalData = await prisma.user.findUnique({
        //   where: {
        //     id: user.user_id,
        //   },
        //   include: {
        //     GoalAssignee: {
        //       where: {
        //         AND: [
        //           { status: "OnTrack" },
        //           {
        //             goal: {
        //               AND: [
        //                 { end_date: { gt: moment().format() } },
        //                 { is_archived: false },
        //                 { frequency: "halfyearly" },
        //                 { goal_type: "Individual" },
        //                 { organization_id: user.organization_id },
        //               ],
        //             },
        //           },
        //         ],
        //       },
        //       include: {
        //         goal: {
        //           include: {
        //             GoalAssignee: {
        //               include: {
        //                 assignee: {
        //                   select: {
        //                     id: true,
        //                     email: true,
        //                   },
        //                 },
        //               },
        //             },
        //           },
        //         },
        //       },
        //     },
        //   },
        // });

        await wait(2000);
      }, Promise.resolve());
      await wait(1000);
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

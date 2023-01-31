const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import {
  GoalCustomizeMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

const BASE_URL = process.env.NEXT_APP_URL;

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
    },
  });

  const goalFilterData = goalData.map((goal) => ({
    ...goal,
    GoalAssignee: goal.GoalAssignee.filter(
      (assignee) => assignee.assignee_id !== goal.created_by
    ),
  }));

  prisma.$disconnect();
  if (goalFilterData && Number(goalFilterData?.length) > 0) {
    goalFilterData.forEach((item) => {
      if (item.GoalAssignee.length > 0) {
        item.GoalAssignee.forEach((user) => {
          if (user.assignee.UserDetails && user.assignee.UserDetails.slack_id) {
            let customText = GoalCustomizeMessage({
              header: `Hey ${user.assignee?.first_name ?? "mate"}`,
              subText:
                "You have a pending goal, please make sure to complete it on time.",
              link: `${BASE_URL}goals`,
              btnText: "Goals",
            });

            SlackPostMessage({
              channel: user.assignee.UserDetails.slack_id,
              text: `Goal is pending.`,
              blocks: customText,
            });
          }
        });
      }
    });
  }

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

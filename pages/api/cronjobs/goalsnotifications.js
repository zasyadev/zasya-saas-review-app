const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import {
  GoalCustomizeMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

const timeBetween = {
  lte: moment().add(1, "day").format(),
  gte: moment().format(),
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
      message: " Wrong Password",
      status: 401,
    });
  }

  const goalData = await prisma.goals.findMany({
    where: {
      end_date: timeBetween,
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

  prisma.$disconnect();
  if (goalData && goalData.length > 0) {
    goalData.forEach((item) => {
      if (item.GoalAssignee.length > 0) {
        item.GoalAssignee.forEach((user) => {
          if (user.assignee.UserDetails && user.assignee.UserDetails.slack_id) {
            let customText = GoalCustomizeMessage({
              header: `Hey ${user.assignee?.first_name ?? "mate"}`,
              subText: "Your Goal DeadLine is Coming.",
              link: `${process.env.NEXT_APP_URL}goals`,
              btnText: "Goals ",
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

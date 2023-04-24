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

const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res) {
  if (req.method != "POST") throw new BadRequestException("Method not allowed");

  const { password } = req.body;
  if (password != process.env.NEXT_APP_CRON_PASSWORD)
    throw new BadRequestException("Wrong Password");

  const goalData = await prisma.goals.findMany({
    where: {
      AND: [{ end_date: timeBetween }, { is_archived: false }],
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
              subText: "Your Goal Deadline is Coming.",
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

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import {
  CustomizeCronSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res) {
  if (req.method != "POST") {
    return res.status(401).json({
      status: 404,
      message: "Method not allowed",
    });
  }
  const { password } = req.body;
  console.log("passw", process.env.NEXT_APP_CRON_PASSWORD);
  if (password != process.env.NEXT_APP_CRON_PASSWORD) {
    return res.status(401).json({
      message: " Wrong Password",
      status: 401,
    });
  }

  const reviewAssignedData = await prisma.reviewAssignee.findMany({
    where: { status: null },
    include: {
      assigned_to: {
        include: { UserDetails: true },
      },
    },
  });
  prisma.$disconnect();
  let assigneData = reviewAssignedData.map((item) => {
    if (
      item.created_date &&
      item.assigned_to.UserDetails &&
      item.assigned_to.UserDetails.slack_id
    ) {
      let customText = CustomizeCronSlackMessage({
        header: "You haven't answered your review.",

        link: `${process.env.NEXT_APP_URL}review/id/${item.id}`,
      });
      SlackPostMessage({
        channel: item.assigned_to.UserDetails.slack_id,
        text: `You haven't answered your review.`,
        blocks: customText,
      });
    }
  });

  return res.status(201).json({
    message: " Success",
    status: 200,
  });
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

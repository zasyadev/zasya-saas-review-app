const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res) {
  if (req.method != "POST") throw new BadRequestException("Method not allowed");

  const { password } = req.body;

  if (password != process.env.NEXT_APP_CRON_PASSWORD)
    throw new BadRequestException("Wrong Password");

  const reviewAssignedData = await prisma.reviewAssignee.findMany({
    where: { status: null },
    include: {
      assigned_to: {
        include: { UserDetails: true },
      },
      review: {
        include: {
          created: {
            select: {
              first_name: true,
            },
          },
        },
      },
    },
  });

  prisma.$disconnect();
  reviewAssignedData.forEach((item) => {
    if (
      item.created_date &&
      item.assigned_to.UserDetails &&
      item.assigned_to.UserDetails.slack_id
    ) {
      let customText = CustomizeSlackMessage({
        header: "Feedback is pending.",
        link: `${BASE_URL}review/id/${item.id}`,
        user: item?.review?.created?.first_name ?? "",
        by: "Review Assigned By",
      });
      SlackPostMessage({
        channel: item.assigned_to.UserDetails.slack_id,
        text: `Feedback is pending.`,
        blocks: customText,
      });
    }
  });

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

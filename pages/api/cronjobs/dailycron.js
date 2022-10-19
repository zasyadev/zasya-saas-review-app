const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import {
  CustomizeSlackMessage,
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
  let assigneData = reviewAssignedData.map((item) => {
    if (
      item.created_date &&
      item.assigned_to.UserDetails &&
      item.assigned_to.UserDetails.slack_id
    ) {
      let customText = CustomizeSlackMessage({
        header: "Feedback is pending.",
        link: `${process.env.NEXT_APP_URL}review/id/${item.id}`,
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
    message: " Success",
    status: 200,
  });
}

const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);

export default functionHandle;

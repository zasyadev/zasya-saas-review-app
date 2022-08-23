const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import {
  CustomizeCronSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;

    if (password === process.env.NEXT_APP_CRON_PASSWORD) {
      const currentMonth = {
        lte: moment().endOf("month").format(),
        gte: moment().startOf("month").format(),
      };

      const userData = await prisma.user.findMany({
        where: { AND: [{ status: 1 }] },
        select: {
          UserDetails: true,
          userCreated: {
            where: {
              created_date: currentMonth,
            },
          },
        },
      });

      prisma.$disconnect();

      let schedule = userData.map((item) => {
        if (
          item.UserDetails &&
          item.UserDetails.slack_id &&
          item.userCreated.length < 3
        ) {
          let customText = CustomizeCronSlackMessage({
            header: "Need to Add New Applaud",
            link: `${process.env.NEXT_APP_URL}applaud/add`,
          });
          SlackPostMessage({
            channel: item.UserDetails.slack_id,
            text: `Need to Add New Applaud`,
            blocks: customText,
          });
        }
      });

      return res.status(201).json({
        message: " Success",
        status: 200,
      });
    }
    return res.status(401).json({
      message: " Wrong Password",
      status: 401,
    });
  }
  return res.status(401).json({
    message: " Method not found",
    status: 401,
  });
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

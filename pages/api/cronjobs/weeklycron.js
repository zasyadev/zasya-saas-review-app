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
        where: {
          AND: [{ status: 1 }],
        },
        select: {
          id: true,
          UserDetails: true,
        },
      });
      const applaudData = await prisma.userApplaud.findMany({
        where: {
          created_date: currentMonth,
        },
      });

      let filterdata = [];
      if (userData.length && applaudData.length) {
        filterdata = userData.map((userItem) => {
          let applaudBy = applaudData.filter(
            (applaudItem) => userItem.id === applaudItem.created_by
          );

          return { ...userItem, applaudBy: applaudBy };
        });
      }

      prisma.$disconnect();

      let schedule = filterdata.map((item) => {
        if (
          item.UserDetails &&
          item.UserDetails.slack_id &&
          item.applaudBy.length < 2
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
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import {
  CustomizeMonthlyCronSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;

    if (password === process.env.NEXT_APP_CRON_PASSWORD) {
      const lastMonth = {
        lte: moment().subtract(1, "months").endOf("month").format(),
        gte: moment().subtract(1, "months").startOf("month").format(),
      };

      const userData = await prisma.user.findMany({
        where: { AND: [{ status: 1 }] },
        select: {
          UserDetails: true,
        },
      });

      prisma.$disconnect();
      if (userData && userData.length) {
        let schedule = userData.map(async (item) => {
          let reviewCreated = await prisma.review.findMany({
            where: {
              AND: [
                {
                  created_by: item.id,
                },
                {
                  organization_id: item.organization_id,
                },
                { created_date: lastMonth },
              ],
            },
          });
          let reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
            where: {
              AND: [
                {
                  user_id: item.id,
                },
                {
                  organization_id: item.organization_id,
                },
                { created_date: lastMonth },
              ],
            },
          });

          let applaudCreated = await prisma.userApplaud.findMany({
            where: {
              AND: [
                { user_id: item.id },
                { organization_id: item.organization_id },
                { created_date: lastMonth },
              ],
            },
          });
          if (item.UserDetails && item.UserDetails.slack_id) {
            let customText = CustomizeMonthlyCronSlackMessage({
              applaudCount: applaudCreated ? applaudCreated.length : 0,
              reviewCreatedCount: reviewCreated ? reviewCreated.length : 0,
              reviewAnsweredCount: reviewAnswered ? reviewAnswered.length : 0,
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
      } else {
        return res.status(401).json({
          message: " No User Found",
          status: 401,
        });
      }
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

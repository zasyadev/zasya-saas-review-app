const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import {
  CustomizeMonthlyCronSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";

async function handle(req, res) {
  const { password } = req.body;

  if (!password === process.env.NEXT_APP_CRON_PASSWORD)
    throw new BadRequestException("Wrong Password");

  const lastMonth = {
    lte: moment().subtract(1, "months").endOf("month").format(),
    gte: moment().subtract(1, "months").startOf("month").format(),
  };

  const userData = await prisma.user.findMany({
    where: { AND: [{ status: 1 }] },
    select: {
      id: true,
      UserDetails: true,
    },
  });

  prisma.$disconnect();

  if (!userData && userData.length <= 0)
    throw new BadRequestException("No user Found");

  userData.forEach(async (item) => {
    let reviewCreated = await prisma.review.findMany({
      where: {
        AND: [
          { created_by: item.id },
          { organization_id: item.organization_id },
          { created_date: lastMonth },
        ],
      },
    });
    let reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
      where: {
        AND: [
          { user_id: item.id },
          { organization_id: item.organization_id },
          { created_date: lastMonth },
        ],
      },
    });

    let applaudCreated = await prisma.userApplaud.findMany({
      where: {
        AND: [
          { created_by: item.id },
          { organization_id: item.organization_id },
          { created_date: lastMonth },
        ],
      },
    });
    let goalCreated = await prisma.goals.findMany({
      where: {
        AND: [
          { created_by: item.id },
          { organization_id: item.organization_id },
          { created_date: lastMonth },
        ],
      },
    });
    let followUpCreated = await prisma.meetings.findMany({
      where: {
        AND: [
          { created_by: item.id },
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
        followUpCount: followUpCreated ? followUpCreated.length : 0,
        goalsCount: goalCreated ? goalCreated.length : 0,
      });
      SlackPostMessage({
        channel: item.UserDetails.slack_id,
        text: `Monthly Report`,
        blocks: customText,
      });
    }
  });

  return res.status(201).json({
    message: " Success",
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

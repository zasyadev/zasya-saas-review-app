const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import moment from "moment";
import { INITIAL_CRON_TYPES } from "../../../constants";
import {
  SlackPostMessage,
  WeeklyCustomizeReviewMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

const ApplaudSlackMessage = (name) => ({
  header: `Hey ${name ?? "mate"}`,
  subText: "Did you tried to appreciate your team mates.",
  text: "Take a little time to appreciate them.",
  link: `${process.env.NEXT_APP_URL}applaud/add`,
  btnText: "Create Applaud ",
});

const ReviewSlackMessage = (name) => ({
  header: `Hey ${name ?? "mate"}`,
  subText: "Did you tried to get a feedback from your peers",
  text: "It will help you to enhance your performance. Let's get some feedback.",
  link: `${process.env.NEXT_APP_URL}review?create=true`,
  btnText: "Create Review ",
});

const currentMonth = {
  lte: moment().endOf("month").format(),
  gte: moment().startOf("month").format(),
};

async function handle(req, res) {
  const { password, type } = req.body;

  if (password !== process.env.NEXT_APP_CRON_PASSWORD) {
    return res.status(401).json({
      message: " Wrong Password",
      status: 401,
    });
  }

  const userData = await prisma.user.findMany({
    where: {
      AND: [{ status: 1 }],
    },
    select: {
      id: true,
      first_name: true,
      UserDetails: true,
    },
  });
  const applaudData = await prisma.userApplaud.findMany({
    where: {
      created_date: currentMonth,
    },
  });
  const reviewData = await prisma.review.findMany({
    where: {
      created_date: currentMonth,
    },
  });
  prisma.$disconnect();

  let filteredApplaudData = [];
  let filteredReviewData = [];

  if (type === INITIAL_CRON_TYPES.APPLAUD) {
    if (userData.length) {
      filteredApplaudData = userData.map((userItem) => {
        let applaudBy = applaudData.filter(
          (applaudItem) => userItem.id === applaudItem.created_by
        );

        return { ...userItem, applaudBy: applaudBy };
      });
    }

    filteredApplaudData.forEach((item) => {
      if (
        item.UserDetails &&
        item.UserDetails.slack_id &&
        item.applaudBy.length < 3
      ) {
        let customText = WeeklyCustomizeReviewMessage(
          ApplaudSlackMessage(item.first_name)
        );
        SlackPostMessage({
          channel: item.UserDetails.slack_id,
          blocks: customText,
        });
      }
    });
  } else {
    if (userData.length) {
      filteredReviewData = userData.map((userItem) => {
        let reviewBy = reviewData.filter(
          (reviewItem) => userItem.id === reviewItem.created_by
        );

        return { ...userItem, reviewBy: reviewBy };
      });
    }
    filteredReviewData.forEach((item) => {
      if (
        item.UserDetails &&
        item.UserDetails.slack_id &&
        item.reviewBy.length < 2
      ) {
        let customText = WeeklyCustomizeReviewMessage(
          ReviewSlackMessage(item.first_name)
        );
        SlackPostMessage({
          channel: item.UserDetails.slack_id,
          blocks: customText,
        });
      }
    });
  }

  return res.status(201).json({
    message: " Success",
    status: 200,
  });
}

const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { REVIEW_FREQUENCY } from "../../../component/Review/constants";
import { daysDiffrenceInDates } from "../../../helpers/momentHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

const createFrequencyData = async (review) => {
  let assigneeData = await prisma.reviewAssignee.findMany({
    where: { review_id: review.id },
  });
  let newAssignData = [];
  assigneeData.forEach((assignItem) => {
    newAssignData.push({
      review: { connect: { id: review.id } },
      assigned_to: { connect: { id: assignItem.assigned_to_id } },
    });
  });

  newAssignData.map(async (item) => {
    return await prisma.reviewAssignee.create({
      data: item,
    });
  });

  return await prisma.review.update({
    where: { id: review.id },
    data: {
      modified_date: new Date(),
    },
  });
};

async function handle(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;
    if (password === process.env.NEXT_APP_CRON_PASSWORD) {
      const reviewData = await prisma.review.findMany({
        where: {
          AND: [{ frequency_status: false }, { is_published: "published" }],
          NOT: {
            frequency: REVIEW_FREQUENCY.ONCE,
          },
        },
      });

      reviewData.map(async (item) => {
        if (!item.frequency_status) {
          const diffDays = daysDiffrenceInDates(item.modified_date);

          if (item.frequency === REVIEW_FREQUENCY.MONTHLY && diffDays > 30) {
            await createFrequencyData(item);
          }
          if (item.frequency === REVIEW_FREQUENCY.WEEKLY && diffDays > 7) {
            await createFrequencyData(item);
          }
          if (item.frequency === REVIEW_FREQUENCY.DAILY && diffDays > 1) {
            await createFrequencyData(item);
          }
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

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: false,
  });

export default functionHandle;

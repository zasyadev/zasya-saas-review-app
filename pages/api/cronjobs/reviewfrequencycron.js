const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { REVIEW_FREQUENCY } from "../../../component/Review/constants";
import { daysDiffrenceInDates } from "../../../helpers/momentHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

const createFrequencyData = async (review) => {
  const assigneeList = await review.ReviewAssignee.map((assignee) => {
    return {
      assigned_to_id: assignee.assigned_to_id,
    };
  });

  const reviewData = await prisma.review.create({
    data: {
      review_name: review.review_name,
      form: { connect: { id: review.form_id } },
      created: { connect: { id: review.created_by } },
      status: review.status,
      frequency: review.frequency,
      frequency_status: true,
      review_type: review.review_type,
      organization: { connect: { id: review.organization_id } },
      role: { connect: { id: review.role_id } },
      parent_id: review.created_by,
      review_parent_id: review.id,
      is_published: review.is_published,
      ReviewAssignee: {
        create: assigneeList,
      },
    },
  });
  if (reviewData) {
    await prisma.review.update({
      where: {
        id: review.id,
      },
      data: {
        modified_date: new Date(),
      },
    });
  }
  return reviewData;
};

async function handle(req, res) {
  if (req.method !== "POST") throw BadRequestException("Method not found");

  const { password } = req.body;

  if (password !== process.env.NEXT_APP_CRON_PASSWORD)
    throw BadRequestException("Wrong Password");

  const reviewData = await prisma.review.findMany({
    where: {
      AND: [{ frequency_status: false }, { is_published: "published" }],
      NOT: { frequency: REVIEW_FREQUENCY.ONCE },
    },
    include: {
      ReviewAssignee: true,
    },
  });

  reviewData.forEach(async (item) => {
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

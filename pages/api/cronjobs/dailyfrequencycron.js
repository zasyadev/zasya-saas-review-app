const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");

import { DATE_FORMAT } from "../../../helpers/dateHelper";
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
      message: "Wrong Password",
      status: 401,
    });
  }
  const reviewData = await prisma.review.findMany({
    where: {
      AND: [
        { frequency: "daily" },
        { frequency_status: false },
        { is_published: "published" },
      ],
    },
  });

  reviewData.map(async (item) => {
    let createdDate = moment(item.created_date).format(DATE_FORMAT);
    let todayDate = moment().format(DATE_FORMAT);

    if (!item.frequency_status && createdDate != todayDate) {
      let assigneeData = await prisma.reviewAssignee.findMany({
        where: { review_id: item.id },
      });
      let newAssignData = [];
      let assignData = assigneeData.forEach((assignItem) => {
        newAssignData.push({
          review: { connect: { id: item.id } },
          assigned_to: { connect: { id: assignItem.assigned_to_id } },
        });
      });

      newAssignData.map(async (item) => {
        return await prisma.reviewAssignee.create({
          data: item,
        });
      });
    }
  });

  return res.status(201).json({
    message: " Success",
    status: 200,
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

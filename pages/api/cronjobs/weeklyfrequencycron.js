const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;
    if (password === process.env.NEXT_APP_CRON_PASSWORD) {
      const reviewData = await prisma.review.findMany({
        where: {
          AND: [
            { frequency: "weekly" },
            { frequency_status: false },
            { is_published: "published" },
          ],
        },
      });

      reviewData.map(async (item) => {
        if (!item.frequency_status) {
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

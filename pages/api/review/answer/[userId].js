import { PrismaClient } from "@prisma/client";
const scheduler = require("node-schedule");

const prisma = new PrismaClient();

export default async (req, res) => {
  const { userId } = req.query;
  const reqData = JSON.parse(req.body);

  if (req.method === "POST") {
    try {
      if (userId) {
        const data = await prisma.reviewAssigneeAnswers.findMany({
          where: {
            review_assignee_id: reqData.id,
            user_id: reqData.assigned_to_id,
          },
          orderBy: { id: "desc" },
          include: {
            ReviewAssigneeAnswerOption: {
              include: { question: true },
            },
          },
        });

        prisma.$disconnect();
        if (data) {
          return res.status(200).json({
            status: 200,
            data: data,
            message: "All Data Retrieved",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

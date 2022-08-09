import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { review_id } = req.query;
  const { userId } = JSON.parse(req.body);

  try {
    if (req.method === "POST") {
      if (review_id && userId) {
        const data = await prisma.reviewAssigneeAnswers.findMany({
          where: {
            AND: [{ user_id: userId }, { review_assignee_id: review_id }],
          },
          include: {
            ReviewAssigneeAnswerOption: true,
          },
        });
        console.log(data, "data");

        prisma.$disconnect();
        if (data) {
          return res.status(200).json({
            status: 200,
            data: data,
            message: "Review Details Retrieved",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } else {
      return res.status(405).json({
        message: "Method Not allowed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

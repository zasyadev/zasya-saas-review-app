import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  const { review_id } = req.query;

  if (req.method === "GET") {
    try {
      if (review_id) {
        const data = await prisma.reviewAssigneeAnswers.findMany({
          where: {
            review_id: review_id,
          },
          orderBy: { id: "desc" },
          include: {
            ReviewAssigneeAnswerOption: {
              include: { question: true },
            },
            user: {
              select: { first_name: true, last_name: true },
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

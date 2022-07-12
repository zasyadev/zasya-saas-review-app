import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { review_id } = req.query;

  try {
    if (req.method === "GET") {
      if (review_id) {
        const data = await prisma.review.findUnique({
          where: { id: review_id },
          include: {
            created: true,
            form: true,
            ReviewAssignee: {
              include: {
                assigned_to: true,
              },
            },
          },
        });

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
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

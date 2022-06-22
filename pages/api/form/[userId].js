import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { userId } = req.query;
  try {
    if (req.method === "GET") {
      if (userId) {
        const data = await prisma.reviewAssignee.findMany({
          where: { assigned_to_id: userId },
          include: {
            review: {
              include: {
                assigned_by: true,
                form: {
                  include: {
                    questions: {
                      include: { options: true },
                    },
                  },
                },
              },
            },
          },
        });
        prisma.$disconnect();
        if (data) {
          return res.status(200).json({
            status: 200,
            data: data,
            message: "Assign Details Retrieved",
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

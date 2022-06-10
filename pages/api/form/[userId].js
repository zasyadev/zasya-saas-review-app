import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const data = await prisma.reviewAssign.findMany({
        where: { assigned_to_id: userId },
        include: {
          assigned_by: true,
          assigned_to: true,
          template: {
            include: {
              questions: {
                include: { options: true },
              },
            },
          },
        },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Assign Details Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { template_id } = req.query;
  const { userId } = JSON.parse(req.body);

  try {
    if (req.method === "POST") {
      if (userId && template_id) {
        const data = await prisma.reviewTemplate.findMany({
          where: {
            AND: [
              {
                id: template_id,
              },
              {
                user_id: userId,
              },
            ],
          },
        });

        prisma.$disconnect();
        if (data) {
          return res.status(200).json({
            status: 200,
            data: data[0],
            message: "Templates Retrieved",
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

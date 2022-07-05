import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const data = await prisma.userApplaud({
        where: { created_by: userId },
        include: { user: true, created: true },
      });

      prisma.$disconnect();
      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Applaud Data Received",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } else if (req.method === "POST") {
    if (userId) {
      const data = await prisma.userApplaud.findMany({
        where: { user_id: userId },
        include: { user: true, created: true },
      });

      prisma.$disconnect();
      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Data Received",
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

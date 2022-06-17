import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const reviewCreated = await prisma.reviewAssign.findMany({
        where: { assigned_by_id: userId },
        include: {
          assigned_by: true,
          assigned_to: true,
          form: {
            include: {
              questions: {
                include: { options: true },
              },
            },
          },
        },
      });
      const reviewAnswered = await prisma.reviewAnswers.findMany({
        where: { user_id: userId },
      });
      const userData = await prisma.user.findMany();

      let data = {
        reviewCreated: reviewCreated.length,
        reviewAnswered: reviewAnswered.length,
        userData: userData.length,
      };

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Dashboard Data Received",
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

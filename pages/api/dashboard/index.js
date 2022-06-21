import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const reqBody = JSON.parse(req.body);

  if (req.method === "POST") {
    if (reqBody.userId) {
      const reviewCreated = await prisma.review.findMany({
        where: { assigned_by_id: reqBody.userId },
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
      });
      // let reviewAnswered = [];
      // if (reqBody.role == 2) {
      let reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
        where: {
          user: {
            is: { organization_id: reqBody.orgId },
          },
        },
      });
      // } else {
      //   reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
      //     where: { organization_id: reqBody.orgId },
      //   });
      // }

      const userData = await prisma.user.findMany({
        where: { organization_id: reqBody.orgId },
      });

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

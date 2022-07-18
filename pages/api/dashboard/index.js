import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const reqBody = JSON.parse(req.body);

  if (req.method === "POST") {
    if (reqBody.userId) {
      const userTableData = await prisma.user.findUnique({
        where: { id: reqBody.userId },
      });
      const reviewCreated = await prisma.review.findMany({
        where: { created_by: reqBody.userId },
        include: {
          created: true,

          form: {
            include: {
              questions: {
                include: { options: true },
              },
            },
          },
        },
      });
      const reviewRating = await prisma.review.findMany({
        where: { created_by: reqBody.userId },
        include: {
          ReviewAssigneeAnswers: {
            include: { ReviewAssigneeAnswerOption: true },
          },
        },
      });
      let reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
        where: {
          user: {
            is: { organization_id: userTableData.organization_id },
          },
        },
      });
      // } else {
      //   reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
      //     where: { organization_id: reqBody.orgId },
      //   });
      // }

      const userData = await prisma.user.findMany({
        where: { organization_id: userTableData.organization_id },
      });
      const applaudData = await prisma.userApplaud.findMany({
        where: { user_id: reqBody.userId },
        include: {
          created: true,
        },
      });

      let data = {
        reviewCreated: reviewCreated.length,
        reviewAnswered: reviewAnswered.length,
        userData: userData.length,
        applaudData: applaudData,
        reviewRating: reviewRating,
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

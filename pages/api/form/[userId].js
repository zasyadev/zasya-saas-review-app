import prisma from "../../../lib/prisma";

export default async (req, res) => {
  const { userId } = req.query;
  try {
    if (req.method === "GET") {
      if (userId) {
        const userData = await prisma.user.findUnique({
          where: { id: userId },
        });

        const data = await prisma.reviewAssignee.findMany({
          orderBy: [
            {
              modified_date: "desc",
            },
          ],
          where: {
            AND: [
              {
                assigned_to_id: userId,
              },
              {
                review: {
                  is: { organization_id: userData.organization_id },
                },
              },
            ],
          },
          include: {
            review: {
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
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

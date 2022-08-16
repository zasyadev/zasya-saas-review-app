import prisma from "../../../lib/prisma";

export default async (req, res) => {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const userData = await prisma.user.findUnique({
        where: { id: userId },
      });

      let data = await prisma.review.findMany({
        orderBy: [
          {
            modified_date: "desc",
          },
        ],
        where: {
          AND: [
            {
              created_by: userId,
            },
            {
              organization_id: userData.organization_id,
              // is_published: "draft",
            },
          ],
        },
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
          message: "All Data Retrieved",
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

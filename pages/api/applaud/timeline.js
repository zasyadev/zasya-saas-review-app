import prisma from "../../../lib/prisma";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }

  try {
    const { date, userId } = JSON.parse(req.body);
    if (userId && date) {
      const userTableData = await prisma.user.findUnique({
        where: { id: userId },
      });

      const allApplaudData = await prisma.userApplaud.findMany({
        orderBy: [
          {
            created_date: "desc",
          },
        ],
        where: {
          AND: [
            { organization_id: userTableData.organization_id },
            {
              created_date: date,
            },
          ],
        },
        include: {
          user: {
            select: {
              first_name: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
          created: {
            select: {
              first_name: true,
            },
          },
        },
      });

      prisma.$disconnect();
      if (allApplaudData.length) {
        return res.status(200).json({
          status: 200,
          data: allApplaudData,
          message: "Applaud Data Received",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error,
      message: "Internal Server Error",
    });
  }
};

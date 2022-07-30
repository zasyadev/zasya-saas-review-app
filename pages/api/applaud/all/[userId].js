import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (userId) {
        const userTableData = await prisma.user.findUnique({
          where: { id: userId },
        });

        const applaudData = await prisma.userApplaud.findMany({
          where: { organization_id: userTableData.organization_id },
          include: {
            user: true,
          },
        });

        let filterApplaudData = [];
        if (applaudData.length > 0) {
          filterApplaudData = applaudData.filter((item) => {
            delete item?.user?.password;
            return true;
          });
        }

        prisma.$disconnect();
        if (filterApplaudData) {
          return res.status(200).json({
            status: 200,
            data: filterApplaudData,
            message: "Applaud Data Received",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        error: error,
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

import prisma from "../../../lib/prisma";

export default async (req, res) => {
  const reqBody = req.body;

  if (req.method === "POST") {
    try {
      if (reqBody.userId) {
        const userTableData = await prisma.user.findUnique({
          where: { id: reqBody.userId },
        });

        let query =
          await prisma.$queryRaw`SELECT     COUNT(*) as count,MONTH( created_date) as month 
        FROM      review 
        WHERE     YEAR(created_date) =  YEAR(CURDATE()) AND organization_id = ${userTableData.organization_id}
        GROUP BY  MONTH(created_date)`;

        const chartData = [...Array(12)].map((_, indx) => {
          const checkMonth = query.find((i) => i.month == indx + 1);
          if (checkMonth) {
            return checkMonth.count;
          }
          return 0;
        });

        if (chartData.length) {
          return res.status(200).json({
            status: 200,
            data: chartData,
            message: "Chart Data Received",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Internal Server Error",
        errorMessage: error,
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

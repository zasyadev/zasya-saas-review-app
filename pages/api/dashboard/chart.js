import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

const getDashBoardChartActivity = (query) => {
  const data = [...Array(12)].map((_, indx) => {
    const checkMonth = query.find((i) => i.month == indx + 1);
    if (checkMonth) {
      return Number(checkMonth.count);
    }
    return 0;
  });
  return data;
};

async function handle(_, res, prisma, user) {
  const { id: userId, organization_id } = user;

  if (!userId || !organization_id)
    throw new BadRequestException("No user found");

  const reviewQuery =
    await prisma.$queryRaw`SELECT     COUNT(*) as count,MONTH( created_date) as month
      FROM      review
      WHERE     YEAR(created_date) =  YEAR(CURDATE()) AND organization_id = ${organization_id}
      GROUP BY  MONTH(created_date)`;

  const reviewChartData = getDashBoardChartActivity(reviewQuery);

  const goalQuery =
    await prisma.$queryRaw`SELECT     COUNT(*) as count,MONTH( created_date) as month
      FROM      goals
      WHERE     YEAR(created_date) =  YEAR(CURDATE()) AND organization_id = ${organization_id}
      GROUP BY  MONTH(created_date)`;
  const goalChartData = getDashBoardChartActivity(goalQuery);

  const applaudQuery =
    await prisma.$queryRaw`SELECT     COUNT(*) as count,MONTH( created_date) as month
    FROM      user_applaud
    WHERE     YEAR(created_date) =  YEAR(CURDATE()) AND organization_id = ${organization_id}
    GROUP BY  MONTH(created_date)`;

  const applaudChartData = getDashBoardChartActivity(applaudQuery);

  if (
    reviewChartData.length &&
    goalChartData.length &&
    applaudChartData.length
  ) {
    return res.status(200).json({
      status: 200,
      data: {
        reviewChartData,
        goalChartData,
        applaudChartData,
      },
      message: "Chart Data Received",
    });
  }

  return res.status(404).json({ status: 404, message: "No Record Found" });
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: true,
  });

export default functionHandle;

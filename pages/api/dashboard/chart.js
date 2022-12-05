import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;

  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  const userTableData = await prisma.user.findUnique({
    where: { id: userId },
  });

  let query =
    await prisma.$queryRawUnsafe`SELECT     COUNT(*) as count,MONTH( created_date) as month 
        FROM      review 
        WHERE     YEAR(created_date) =  YEAR(CURDATE()) AND organization_id = ${userTableData.organization_id}
        GROUP BY  MONTH(created_date)`;

  const chartData = [...Array(12)].map((_, indx) => {
    const checkMonth = query.find((i) => i.month == indx + 1);
    if (checkMonth) {
      return Number(checkMonth.count);
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

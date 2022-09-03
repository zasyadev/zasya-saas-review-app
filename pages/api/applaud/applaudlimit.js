import moment from "moment";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.body;
  const currentMonth = {
    lte: moment().endOf("month").format(),
    gte: moment().startOf("month").format(),
  };
  if (!req.method === "POST") {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const userOrgData = await prisma.userOrganization.findUnique({
    where: {
      id: userData.organization_id,
    },
  });
  const data = await prisma.userApplaud.findMany({
    where: {
      AND: [
        { created_by: userId },
        { created_date: currentMonth },
        { organization_id: userData.organization_id },
      ],
    },
  });

  if (data && userOrgData) {
    if (data.length > userOrgData.applaud_count) {
      return res.status(400).json({
        status: 400,
        data: userOrgData.applaud_count,
        message: "Max Appluad Reached For This Month",
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: data.length,
        message: "Applaud Still Pending",
      });
    }
  } else {
    return res.status(400).json({
      status: 400,

      message: "Internal Server Error",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

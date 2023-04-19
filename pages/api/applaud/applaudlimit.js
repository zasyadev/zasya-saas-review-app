import moment from "moment";
import { RequestHandler } from "../../../lib/RequestHandler";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";

const currentMonth = {
  lte: moment().endOf("month").format(),
  gte: moment().startOf("month").format(),
};

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;

  if (!userId) throw new BadRequestException("No user found.");

  const userOrgData = await prisma.userOrganization.findUnique({
    where: {
      id: organization_id,
    },
  });
  const data = await prisma.userApplaud.findMany({
    where: {
      AND: [
        { created_by: userId },
        { created_date: currentMonth },
        { organization_id: organization_id },
      ],
    },
  });

  if (!data && !userOrgData) throw new BadRequestException("No record found.");

  if (data.length > userOrgData.applaud_count) {
    return res.status(400).json({
      data: userOrgData.applaud_count,
      message: "Maximum Appluad Reached For This Month",
    });
  } else {
    return res.status(200).json({
      data: data.length,
      message: "Applaud Still Pending",
    });
  }
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

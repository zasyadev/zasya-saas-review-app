import moment from "moment";
import { RequestHandler } from "../../../lib/RequestHandler";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;

  if (!userId || !organization_id)
    throw new BadRequestException("No user found");

  const lastSevenDays = {
    lte: moment().format(),
    gte: moment().subtract(7, "d").format(),
  };

  const data = await prisma.review.findMany({
    orderBy: {
      modified_date: "desc",
    },
    where: {
      AND: [
        { created_by: userId },
        { organization_id: organization_id },
        { created_date: lastSevenDays },
      ],
    },
  });

  return res.status(200).json({
    count: data.length,
    message: "success",
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: false,
  });

export default functionHandle;

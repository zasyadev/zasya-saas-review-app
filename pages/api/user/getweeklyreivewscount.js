import moment from "moment";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;

  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });

  const lastSevenDays = {
    lte: moment().format(),
    gte: moment().subtract(7, "d").format(),
  };

  let data = await prisma.review.findMany({
    orderBy: {
      modified_date: "desc",
    },

    where: {
      AND: [
        {
          created_by: userId,
        },
        {
          organization_id: userData.organization_id,
        },
        { created_date: lastSevenDays },
      ],
    },
  });

  return res.status(200).json({
    status: 200,
    count: Number(data?.length) > 0 ? data?.length : 0,
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

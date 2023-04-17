import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  const userData = await prisma.user.findUnique({
    where: { id: user_id },
  });

  if (!userData) throw BadRequestException("User not found");

  const activityData = await prisma.userActivity.findMany({
    orderBy: {
      id: "desc",
    },
    where: {
      AND: [
        { user_id: user_id },
        { organization_id: userData.organization_id },
      ],
    },
  });

  if (!activityData) throw BadRequestException("Record not found");

  return res.status(200).json({
    data: activityData,
    message: "All Data Retrieved",
  });
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

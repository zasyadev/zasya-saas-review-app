import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  const userData = await prisma.user.findUnique({
    where: { id: user_id },
  });

  const activityData = await prisma.userActivity.findMany({
    orderBy: {
      id: "desc",
    },
    where: {
      AND: [
        { user_id: user_id },
        {
          organization_id: userData.organization_id,
        },
      ],
    },
  });

  return res.status(200).json({
    status: 200,
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

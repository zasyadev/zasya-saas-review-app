import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  const userData = await prisma.user.findUnique({
    where: { id: user_id },
  });

  const notificationData = await prisma.userNotification.findMany({
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
    data: notificationData,
    message: "All Data Retrieved",
  });
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);
export default functionHandle;

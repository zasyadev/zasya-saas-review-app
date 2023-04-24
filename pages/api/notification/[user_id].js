import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  const userData = await prisma.user.findUnique({
    where: { id: user_id },
  });
  if (req.method === "GET") {
    const notificationData = await prisma.userNotification.findMany({
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
    if (!notificationData) throw new BadRequestException("Data not retreived");

    return res.status(200).json({
      data: notificationData,
      message: "All Data Retrieved",
    });
  } else if (req.method === "DELETE") {
    const notificationData = await prisma.userNotification.deleteMany({
      where: {
        AND: [
          { user_id: user_id },
          {
            organization_id: userData.organization_id,
          },
        ],
      },
    });
    if (!notificationData) throw new BadRequestException("Data not deleted");

    return res.status(200).json({
      message: "All Notification Deleted Successfully.",
    });
  }
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "DELETE"],
    protectedRoute: true,
  });
export default functionHandle;

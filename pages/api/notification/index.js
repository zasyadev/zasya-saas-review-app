import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const reqBody = req.body;
  if (reqBody.id) {
    let data = [];
    if (reqBody.id === "ALL") {
      data = await prisma.userNotification.updateMany({
        where: {
          AND: [
            { user_id: reqBody.user_id },
            {
              read_at: null,
            },
          ],
        },
        data: {
          read_at: new Date(),
        },
      });
    } else {
      data = await prisma.userNotification.update({
        where: { id: reqBody.id },
        data: {
          read_at: new Date(),
        },
      });
    }

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Notification Updated",
    });
  }
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: true,
  });

export default functionHandle;

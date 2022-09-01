import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const reqBody = req.body;
  if (reqBody.id) {
    let data = await prisma.userNotification.update({
      where: { id: reqBody.id },
      data: {
        read_at: new Date(),
      },
    });

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Notification Updated",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  if (req.method === "GET") {
    const { id: userId } = user;
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        organization: true,
      },
    });

    if (userData) {
      return res.status(200).json({
        status: 200,
        data: userData,
        message: "Organization Data Received",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Internal Server Error",
      });
    }
  }
  if (req.method === "PUT") {
    const { applaud_count } = req.body;
    const { organization_id } = user;

    const data = await prisma.userOrganization.update({
      where: {
        id: organization_id,
      },
      data: {
        applaud_count: applaud_count,
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Organization Data Updated",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Internal Server Error",
      });
    }
  }
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "PUT"],
    protectedRoute: true,
  });

export default functionHandle;

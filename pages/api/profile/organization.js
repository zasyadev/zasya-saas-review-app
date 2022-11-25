import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    const { userId } = req.body;
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
    const resBody = req.body;

    const userData = await prisma.user.findUnique({
      where: {
        id: resBody.userId,
      },
    });

    const data = await prisma.userOrganization.update({
      where: {
        id: userData.organization_id,
      },
      data: {
        applaud_count: resBody.applaud_count,
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
  RequestHandler(req, res, handle, ["POST", "PUT"]);

export default functionHandle;

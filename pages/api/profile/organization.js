import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  if (req.method === "GET") {
    const { id: userId } = user;
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        organization: true,
      },
    });

    if (!userData) throw new BadRequestException("Bad request");

    return res.status(200).json({
      data: userData,
      message: "Organization Data Received",
    });
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
    if (!data) throw new BadRequestException("Bad request");

    return res.status(200).json({
      data: data,
      message: "Organization Data Updated",
    });
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

import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  if (user_id) {
    const userData = await prisma.user.findUnique({
      where: { id: user_id },
    });
    const data = await prisma.userOraganizationTags.findMany({
      where: { organization_id: userData.organization_id },
    });

    return res.status(200).json({
      status: 200,
      data: data,
      message: "All Data Retrieved",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["GET"]);

import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  if (user_id) {
    const userData = await prisma.user.findUnique({
      where: { id: user_id },
    });
    const data = await prisma.userOraganizationGroups.findMany({
      where: { organization_id: userData.organization_id },

      include: {
        user: true,
      },
    });

    const filterdata = data
      .filter(
        (item) =>
          // (item.user.role_id === 4 || item.user.role_id === 3) &&
          item.status === true
      )
      .map((item) => {
        delete item?.user?.password;
        return item;
      });

    return res.status(200).json({
      status: 200,
      data: filterdata,
      message: "All Data Retrieved",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["GET"]);

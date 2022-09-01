import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;
  const resBody = req.body;

  if (user_id && resBody.org_user) {
    const data = await prisma.user.findUnique({
      where: { id: user_id },
      include: {
        UserOraganizationGroups: true,
      },
    });
    const orgData = await prisma.user.findUnique({
      where: { id: resBody.org_user },
    });

    if (data) {
      let userOrgData = {};

      if (data?.UserOraganizationGroups.length > 0) {
        data?.UserOraganizationGroups.forEach((item) => {
          if (item.organization_id == orgData.organization_id)
            userOrgData = item;
        });
      }
      data["userOrgData"] = userOrgData;
      delete data.password;
      delete data?.UserOraganizationGroups;
      return res.status(200).json({
        status: 200,
        data: data,
        message: "User Details Retrieved",
      });
    }

    return res.status(404).json({ status: 404, message: "No Record Found" });
  }
}
export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

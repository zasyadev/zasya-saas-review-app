import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;
  const resBody = req.body;

  const data = await prisma.user.findUnique({
    where: { id: user_id },
    include: {
      UserOraganizationGroups: true,
    },
  });

  if (!data) throw new BadRequestException("No record found");

  const orgData = await prisma.user.findUnique({
    where: { id: resBody.org_user },
  });

  if (!orgData) throw new BadRequestException("No organization found");
  let userOrgData = {};

  if (data?.UserOraganizationGroups.length > 0) {
    data?.UserOraganizationGroups.forEach((item) => {
      if (item.organization_id == orgData.organization_id) userOrgData = item;
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

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: true,
  });

export default functionHandle;

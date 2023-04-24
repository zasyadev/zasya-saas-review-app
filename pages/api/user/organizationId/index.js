import { USER_SELECT_FEILDS } from "../../../../constants";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;

  const userOrgData = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userOrgData) throw new BadRequestException("No user found");

  const data = await prisma.userOraganizationGroups.findMany({
    where: { organization_id: userOrgData.organization_id },
    include: {
      user: USER_SELECT_FEILDS,
    },
  });
  if (!data) throw new BadRequestException("No record found");

  return res.status(200).json({
    data: data,
    message: "All Data Retrieved",
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: true,
  });

export default functionHandle;

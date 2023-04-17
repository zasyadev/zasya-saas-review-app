import { USER_SELECT_FEILDS } from "../../../constants";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  const userData = await prisma.user.findUnique({
    where: { id: user_id },
  });

  if (!userData) throw BadRequestException("No user found");

  const data = await prisma.userOraganizationGroups.findMany({
    where: {
      AND: [{ organization_id: userData.organization_id }, { status: true }],
    },

    include: {
      user: USER_SELECT_FEILDS,
    },
  });

  if (!data) throw BadRequestException("No records found");

  return res.status(200).json({
    status: 200,
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

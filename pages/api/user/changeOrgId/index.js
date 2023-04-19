import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  const { org_id, roleId } = req.body;

  if (!userId && !org_id && !roleId)
    throw new BadRequestException("Bad request");
  const userData = await prisma.user.update({
    where: { id: userId },
    data: {
      organization_id: org_id,
      role_id: roleId,
    },
  });

  if (!userData) throw new BadRequestException("Organization not updated");
  return res.status(200).json({
    data: userData,
    message: "Organization Updated",
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

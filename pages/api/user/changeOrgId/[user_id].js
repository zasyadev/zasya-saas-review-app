import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;
  const reqBody = req.body;

  if (user_id && reqBody.org_id && reqBody.roleId) {
    let userData = await prisma.user.update({
      where: { id: user_id },
      data: {
        organization_id: reqBody.org_id,
        role_id: reqBody.roleId,
      },
    });

    if (userData) {
      return res.status(200).json({
        status: 200,
        data: userData,
        message: "Organization Updated",
      });
    }
    return res.status(400).json({
      status: 400,
      message: "Organization Not Updated",
    });
  }

  return res.status(404).json({ status: 404, message: "No Record Found" });
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

import { hashedPassword, compareHashedPassword } from "../../../../lib/auth";
import { RequestHandler } from "../../../../lib/RequestHandler";
import { USER_PASSWORD_SCHEMA } from "../../../../yup-schema/user";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  const { old_password, new_password } = req.body;

  if (userId) {
    const data = await prisma.user.findUnique({
      where: { id: userId },
    });
    const compare = await compareHashedPassword(old_password, data.password);
    if (compare) {
      const updateData = await prisma.user.update({
        where: { email: data.email },
        data: {
          password: await hashedPassword(new_password),
        },
      });

      if (updateData) {
        return res.status(200).json({
          status: 200,
          data: updateData,
          message: "Password Updated",
        });
      } else {
        return res
          .status(404)
          .json({ status: 404, message: "No Record Found!" });
      }
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "Old Password incorrect!" });
    }
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: true,
    schemaObj: USER_PASSWORD_SCHEMA,
  });
export default functionHandle;

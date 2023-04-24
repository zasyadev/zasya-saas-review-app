import { hashedPassword, compareHashedPassword } from "../../../../lib/auth";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";
import { USER_PASSWORD_SCHEMA } from "../../../../yup-schema/user";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  const { old_password, new_password } = req.body;

  if (userId) {
    const data = await prisma.user.findUnique({
      where: { id: userId },
    });
    const compare = await compareHashedPassword(old_password, data.password);
    if (!compare) throw new BadRequestException("Old Password incorrect!");
    const updateData = await prisma.user.update({
      where: { email: data.email },
      data: {
        password: await hashedPassword(new_password),
      },
    });
    if (!updateData) throw new BadRequestException("No record found!");
    return res.status(200).json({
      data: updateData,
      message: "Password Updated",
    });
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

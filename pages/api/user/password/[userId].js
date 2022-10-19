import { hashedPassword, compareHashedPassword } from "../../../../lib/auth";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  const reqData = req.body;

  if (userId) {
    const data = await prisma.user.findUnique({
      where: { id: userId },
    });
    const compare = await compareHashedPassword(
      reqData.old_password,
      data.password
    );
    if (compare) {
      const updateData = await prisma.user.update({
        where: { email: data.email },
        data: {
          password: await hashedPassword(reqData.new_password),
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
          .json({ status: 404, message: "No Record Found" });
      }
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "Wrong Old Password" });
    }
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

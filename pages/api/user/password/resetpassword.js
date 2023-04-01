import { USER_STATUS_TYPE } from "../../../../constants";
import { hashedPassword } from "../../../../lib/auth";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { mailService, mailTemplate } from "../../../../lib/emailservice";
import { RequestHandler } from "../../../../lib/RequestHandler";

const SMTP_USER = process.env.SMTP_USER;

async function handle(req, res, prisma) {
  const { token, password } = req.body;

  const data = await prisma.passwordReset.findFirst({
    where: { token: token },
  });

  if (!data) throw new BadRequestException("Invalid token.");

  if (!password) throw new BadRequestException("Password is required.");

  const updateData = await prisma.user.update({
    where: { email: data.email_id },
    data: {
      password: await hashedPassword(password),
      status: USER_STATUS_TYPE.ACTIVE,
    },
  });

  if (!updateData) throw new BadRequestException("No record found.");

  await prisma.passwordReset.delete({
    where: { email_id: data.email_id },
  });

  if (data.created_by_id) {
    const userData = await prisma.user.findUnique({
      where: { id: data.created_by_id },
    });

    if (userData) {
      let mailData = {
        from: SMTP_USER,
        to: userData.email,
        subject: `${updateData.first_name} has accepted your Invitation to collaborate on Review App`,

        html: mailTemplate({
          body: `<b>${updateData.first_name}</b> has accepted your Invitation to collaborate on Review App.`,
          name: userData.first_name,
        }),
      };
      await mailService.sendMail(mailData);
    }
  }

  return res.status(200).json({
    message: "Password has been updated",
  });
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: false,
  });

export default functionHandle;

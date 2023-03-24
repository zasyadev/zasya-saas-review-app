import { hashedPassword } from "../../../../lib/auth";
import { mailService, mailTemplate } from "../../../../lib/emailservice";
import { RequestHandler } from "../../../../lib/RequestHandler";

const BASE_URL = process.env.NEXT_APP_URL;
const SMTP_USER = process.env.SMTP_USER;

async function handle(req, res, prisma) {
  const { email } = req.body;

  const alreadyResetData = await prisma.passwordReset.findUnique({
    where: {
      email_id: email,
    },
  });

  if (alreadyResetData)
    return res.status(402).json({
      message: "Already email has been sent to reset the password.",
    });

  const userData = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userData)
    return res.status(402).json({
      message: "Email address not found.",
    });

  const generatedToken = await hashedPassword(email);

  const passwordResetData = await prisma.passwordReset.create({
    data: {
      email: { connect: { email: email } },
      token: generatedToken,
    },
  });

  if (!passwordResetData)
    return res.status(400).json({ message: "Reset password mail not sent." });

  let mailData = {
    from: SMTP_USER,
    to: email,
    subject: `Review App Forgot Password`,
    html: mailTemplate({
      body: `We recevied a request that you want to reset your password. To reset your password, click the button below.`,
      name: userData?.first_name ?? email,
      btnLink: `${BASE_URL}/resetpassword?passtoken=${generatedToken}&email=${email}`,
      btnText: "Reset Link",
    }),
  };

  const mailResponse = await new Promise((resolve, reject) => {
    mailService.sendMail(mailData, function (err) {
      if (err) {
        reject("FAILED");
      } else {
        resolve("SUCCESS");
      }
    });
  });

  if (mailResponse !== "SUCCESS") {
    await prisma.passwordReset.delete({
      where: { id: passwordResetData.id },
    });
    return res.status(402).json({
      message: "Reset password mail not sent.",
    });
  }
  return res.status(201).json({
    message: "Reset password email sent successfully",
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

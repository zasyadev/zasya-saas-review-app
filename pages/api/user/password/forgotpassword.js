import { hashedPassword } from "../../../../lib/auth";
import { mailService, mailTemplate } from "../../../../lib/emailservice";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const reqBody = req.body;

  let alreadyData = await prisma.passwordReset.findUnique({
    where: {
      email_id: reqBody.email,
    },
  });
  if (alreadyData) {
    return res.status(402).json({
      error: "FAILED",
      message: "Already email has been sent to reset the password.",
    });
  }

  let generatedToken = await hashedPassword(reqBody.email);

  const passwordResetData = await prisma.passwordReset.create({
    data: {
      email: { connect: { email: reqBody.email } },
      token: generatedToken,
    },
  });

  if (passwordResetData) {
    let mailData = {
      from: process.env.SMTP_USER,
      to: reqBody.email,
      subject: `Review App Forgot Password`,
      html: mailTemplate(`
          You have been send Link to Reset Your  Review app Password . Please <a href= ${process.env.NEXT_APP_URL}/resetpassword?passtoken=${generatedToken}&email=${reqBody.email}>click here</a> to collaborate with them now .
          `),
    };

    let mailResponse = await new Promise((resolve, reject) => {
      mailService.sendMail(mailData, function (err, info) {
        if (err) {
          reject("FAILED");
        } else {
          resolve("SUCCESS");
        }
      });
    });

    if (mailResponse === "SUCCESS") {
      return res.status(201).json({
        message: "Reset password email sent successfully",
        status: 200,
      });
    } else {
      const deleteToken = await prisma.passwordReset.delete({
        where: { id: passwordResetData.id },
      });

      return res.status(402).json({
        error: "FAILED",
        message: "Reset password mail not sent.",
      });
    }
  } else {
    return res.status(400).json({ status: 400, message: "Wrong Token " });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

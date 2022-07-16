import { PrismaClient } from "@prisma/client";
import { hashedPassword } from "../../../../lib/auth";
import { mailService, mailTemplate } from "../../../../lib/emailservice";

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      const reqBody = JSON.parse(req.body);

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
          You have been send Link to Reset Your  Review app Password . Please <a href= ${process.env.NEXT_APP_URL}/resetpassword?passtoken=${generatedToken}>click here</a> to collaborate with them now .
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
            message: "Reset Password Email Sent Successfully",
            status: 200,
          });
        } else {
          const deleteToken = await prisma.passwordReset.delete({
            where: { id: passwordResetData.id },
          });

          return res.status(402).json({
            error: "FAILED",
            message: "Reset Password mail not sent.",
          });
        }
      } else {
        return res.status(400).json({ status: 400, message: "Wrong Token " });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

import prisma from "../../../../lib/prisma";
import { hashedPassword } from "../../../../lib/auth";
import { mailService, mailTemplate } from "../../../../lib/emailservice";

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      const reqBody = req.body;

      const data = await prisma.passwordReset.findFirst({
        where: { token: reqBody.token },
      });

      if (!data) {
        return res
          .status(400)
          .json({ status: 400, message: "Wrong email address " });
      }

      if (reqBody.token === data.token) {
        const updateData = await prisma.user.update({
          where: { email: data.email_id },
          data: {
            password: await hashedPassword(reqBody.password),
            status: 1,
          },
        });

        if (updateData) {
          const deleteData = await prisma.passwordReset.delete({
            where: { email_id: data.email_id },
          });
          if (data.created_by_id) {
            let createdData = await prisma.user.findUnique({
              where: { id: data.created_by_id },
            });

            if (createdData) {
              let mailData = {
                from: process.env.SMTP_USER,
                to: createdData.email,
                subject: `${updateData.first_name} has accepted your Invitation to collaborate on Review App`,
                html: mailTemplate(`
  
                ${updateData.first_name} has accepted your Invitation to collaborate on Review App.
                
                `),
              };

              await mailService.sendMail(mailData, function (err, info) {
                if (err) console.log("failed");
                else console.log("successfull");
              });
            }
          }
          return res.status(200).json({
            status: 200,
            data: updateData,
            message: "Password has been updated",
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: "No record found" });
        }
      } else {
        return res.status(400).json({ status: 400, message: "Invalid token " });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
};

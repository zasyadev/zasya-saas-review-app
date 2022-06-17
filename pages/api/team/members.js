import { PrismaClient } from "@prisma/client";
import { hashedPassword, randomPassword } from "../../../lib/auth";
import { mailService } from "../../../lib/emailservice";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);
      const password = randomPassword(8);

      const transactionData = await prisma.$transaction(async (transaction) => {
        let userobj = {
          email: resData.email,
          // password: await hashedPassword(password),
          first_name: resData.first_name,
          last_name: resData.last_name,
          address: "",
          pin_code: "",
          mobile: "",
          status: resData.status,
          role: { connect: { id: resData.role } },
          organization: { connect: { id: resData.organization_id } },
        };

        const userData = await transaction.user.create({
          data: userobj,
        });

        const passwordResetData = await transaction.passwordReset.create({
          data: {
            email: { connect: { email: userData.email } },
            // token: randomPassword(16),
            token: await hashedPassword(resData.email),
          },
        });

        if (userData.id) {
          const savedTagsData = await transaction.tagsEmployees.create({
            data: {
              user: { connect: { id: userData.id } },
              tags: resData.tags,
            },
          });
        }
        return {
          userData,
          passwordResetData,
        };
      });

      const mailData = {
        from: process.env.SMTP_USER,
        to: transactionData.userData.email,
        subject: `Invitation to collaborate on Review App`,
        html: `
        You have been invited to collaborate on Review app . Please <a href= ${process.env.NEXT_APP_URL}/resetpassword?passtoken=${transactionData.passwordResetData.token}>click here</a> to collaborate with them now .
        `,
      };

      await mailService.sendMail(mailData, function (err, info) {
        if (err) console.log("failed");
        else console.log("successfull");
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "Members Saved Successfully",
        data: transactionData.userData,
        status: 200,
      });
    } catch (error) {
      console.log(error);
      if (error.code === "P2014") {
        return res
          .status(409)
          .json({ error: error, message: "Duplicate Employee" });
      } else if (error.code === "P2002") {
        return res
          .status(410)
          .json({ error: error, message: "Duplicate Employee" });
      } else {
        return res
          .status(500)
          .json({ error: error, message: "Internal Server Error" });
      }
    }
  } else if (req.method === "GET") {
    return;
  } else if (req.method === "PUT") {
    try {
      const resData = JSON.parse(req.body);

      const transactionData = await prisma.$transaction(async (transaction) => {
        const userData = await transaction.user.update({
          where: { email: resData.email },
          data: {
            first_name: resData.first_name,
            last_name: resData.last_name,
            address: "",
            pin_code: "",
            mobile: "",
            status: resData.status,
            TagsEmployees: {
              update: {
                tags: resData.tags,
              },
            },
          },
        });

        return {
          userData,
        };
      });

      prisma.$disconnect();

      return res.status(200).json({
        message: "Members Updated Successfully.",
        status: 200,
        data: transactionData.userData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.email) {
      const transactionData = await prisma.$transaction(async (transaction) => {
        const deletaData = await transaction.user.update({
          where: { email: reqBody.email },
          data: { status: 0 },
        });

        return { deletaData };
      });

      prisma.$disconnect();
      if (transactionData.deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Members Deleted Successfully.",
        });
      }
      return res.status(400).json({
        status: 400,
        message: "Failed To Delete Record.",
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

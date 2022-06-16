import { PrismaClient } from "@prisma/client";
import { info } from "node-sass";
import { hashedPassword, randomPassword } from "../../../lib/auth";
import { mailService } from "../../../lib/emailservice";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);
      const password = randomPassword(8);
      // let userobj = {
      //   group: { connect: { id: resData.group_id } },
      //   employee: { connect: { id: resData.employee_id } },
      //   is_manager: resData.is_manager,
      // };

      const transactionData = await prisma.$transaction(async (transaction) => {
        let userobj = {
          email: resData.email,
          password: await hashedPassword(password),
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
        };
      });

      const mailData = {
        from: process.env.SMTP_USER,
        to: transactionData.userData.email,
        subject: `Successfully Registered on Zasya Review App`,
        html: `You have successfull registered on Review App . Please Login in with Email ${transactionData.userData.email} and Password  <b>${password}</b>.`,
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
    const resData = JSON.parse(req.body);
    console.log(resData);

    return;
    try {
      const data = await prisma.tagsEmployees.findMany({
        include: {
          user: {
            select: {
              first_name: true,
              email: true,
              status: true,
              last_name: true,
            },
          },
          // group: true,
        },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Members Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const resData = JSON.parse(req.body);

      const data = await prisma.tagsEmployees.update({
        where: { id: resData.id },
        data: {
          user_id: resData.employee_id,

          tags: resData.tags,
        },
      });

      prisma.$disconnect();

      return res.status(200).json({
        message: "Members Updated Successfully.",
        status: 200,
        data: data,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const deletaData = await prisma.tagsEmployees.delete({
        where: { id: reqBody.id },
      });
      prisma.$disconnect();
      if (deletaData) {
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

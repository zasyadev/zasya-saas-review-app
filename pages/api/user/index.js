import { PrismaClient } from "@prisma/client";
import { hashedPassword } from "../../../lib/auth";
import { mailService, mailTemplate } from "../../../lib/emailservice";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const userData = JSON.parse(req.body);
      let orgData = await prisma.userOrganization.findUnique({
        where: {
          company_name: userData.company_name,
        },
      });

      if (orgData) {
        return res
          .status(400)
          .json({ error: "error", message: "Duplicate Company Name" });
      }

      const transactionData = await prisma.$transaction(async (transaction) => {
        const organization = await transaction.userOrganization.create({
          data: {
            company_name: userData.company_name,
          },
        });

        if (organization.id) {
          let userobj = {
            email: userData.email,
            password: await hashedPassword(userData.password),
            first_name: userData.first_name,

            last_name: "",
            address: "",
            pin_code: "",
            mobile: "",

            status: userData.status,
            role: { connect: { id: userData.role } },
            organization: { connect: { id: organization.id } },
          };

          const savedData = await transaction.user.create({
            data: userobj,
          });

          const userOrgGroupData =
            await transaction.userOraganizationGroups.create({
              data: {
                user: { connect: { id: savedData.id } },
                role: { connect: { id: userData.role } },
                organization: {
                  connect: { id: organization.id },
                },
                status: true,
              },
            });

          return {
            savedData,
          };
        }
      });
      prisma.$disconnect();
      const mailData = {
        from: process.env.SMTP_USER,
        to: transactionData.savedData.email,
        subject: `Successfully Registered on Zasya Review App`,
        html: mailTemplate(
          `You have successfull registered on Review App . Please <a href= ${process.env.NEXT_APP_URL}/auth/login>Login</a> in to continue with your Profile.`
        ),
      };

      await mailService.sendMail(mailData, function (err, info) {
        if (err) console.log("failed");
        else console.log("successfull");
      });

      return res.status(201).json({
        message: "User Register Successfully",
        data: transactionData.savedData,
        status: 200,
      });
    } catch (error) {
      console.log(error);
      if (error.code == "P2002") {
        return res
          .status(500)
          .json({ error: error, message: "Duplicate Email Address" });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const reqBody = JSON.parse(req.body);

      return;
      const user = await prisma.user.findUnique({
        where: { email: reqBody.email },
      });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: `No user Registered with ${reqBody.email}`,
        });
      }

      const updateData = await prisma.user.update({
        where: { email: reqBody.email },
        data: {
          password: await hashedPassword(reqBody.password),
        },
      });

      if (!updateData) {
        return res
          .status(409)
          .json({ status: 409, message: "Failed To Update Data" });
      }

      return res
        .status(200)
        .json({ status: 200, message: "Record Updated Succesfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

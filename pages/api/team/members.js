import { hashedPassword } from "../../../lib/auth";
import { mailService, mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";
import { MEMBER_SCHEMA } from "../../../yup-schema/user";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    try {
      const { first_name, email, tags, role, created_by } = req.body;

      let existingData = await prisma.user.findUnique({
        where: { email: email },
      });

      let createdUserData = await prisma.user.findUnique({
        where: { id: created_by },
      });

      let organizationTags = await prisma.userOraganizationTags.findMany({
        where: { organization_id: createdUserData.organization_id },
      });

      if (existingData && createdUserData) {
        let existingOrgUser = await prisma.userOraganizationGroups.findMany({
          where: {
            AND: [
              { user_id: existingData.id },
              { organization_id: createdUserData.organization_id },
            ],
          },
        });

        if (existingOrgUser.length > 0) {
          return res.status(409).json({
            error: "409",
            message: "User with email id already exists!",
          });
        }
      }

      const transactionData = await prisma.$transaction(async (transaction) => {
        let userobj = {
          email: email,
          first_name: first_name,
          last_name: "",
          status: 0,
          role: { connect: { id: role } },
          organization: { connect: { id: createdUserData.organization_id } },
        };

        let existingUser = await transaction.user.findUnique({
          where: { email: email },
        });
        let userData = {};
        let passwordResetData = {};

        if (existingUser) {
          userData = await transaction.userOraganizationGroups.create({
            data: {
              user: { connect: { id: existingUser.id } },
              role: { connect: { id: role } },
              organization: {
                connect: { id: createdUserData.organization_id },
              },
              status: true,
              tags: tags,
            },
          });

          let mailData = {
            from: process.env.SMTP_USER,
            to: userData.email,
            subject: `Successfully Registered on Review App`,

            html: mailTemplate({
              body: `You have successfully registered on Review App. Please login to get started.`,
              name: userData.first_name,
              btnLink: `${process.env.NEXT_APP_URL}/auth/login`,
              btnText: "Get Started",
            }),
          };

          await mailService.sendMail(mailData, function (err, info) {
            // if (err) console.log("failed");
            // else console.log("successfull");
          });
        } else {
          userData = await transaction.user.create({
            data: userobj,
          });
          if (userData.id) {
            await transaction.userOraganizationGroups.create({
              data: {
                user: { connect: { id: userData.id } },
                role: { connect: { id: role } },
                organization: {
                  connect: { id: createdUserData.organization_id },
                },
                status: true,
                tags: tags,
              },
            });

            await transaction.userDetails.create({
              data: {
                user: { connect: { id: userData.id } },
              },
            });
          }
          passwordResetData = await transaction.passwordReset.create({
            data: {
              email: { connect: { email: userData.email } },
              created_by: { connect: { id: created_by } },
              token: await hashedPassword(email),
            },
          });
          let mailData = {
            from: process.env.SMTP_USER,
            to: userData.email,
            subject: `Invitation to collaborate on Review App`,

            html: mailTemplate({
              body: `You have been invited to collaborate on the Review app.`,
              name: userData.first_name,
              btnLink: `${process.env.NEXT_APP_URL}/resetpassword?passtoken=${passwordResetData.token}&email=${userData.email}`,
              btnText: "Get Started",
            }),
          };

          await mailService.sendMail(mailData, function (err, info) {
            // if (err) console.log("failed");
            // else console.log("successfull");
          });
        }
        let newTags = [];
        if (organizationTags.length > 0) {
          newTags = tags.filter((item) => {
            return !organizationTags.find((data) => {
              return data.tag_name === item;
            });
          });
        } else {
          newTags = tags;
        }
        if (newTags.length > 0) {
          let tagsData = [];

          newTags.forEach((item) => {
            tagsData.push({
              user: { connect: { id: createdUserData.id } },
              tag_name: item,
              organization: {
                connect: { id: createdUserData.organization_id },
              },
            });
          });

          tagsData.map(async (item) => {
            return await prisma.userOraganizationTags.create({
              data: item,
            });
          });
        }

        return {
          userData,
          passwordResetData,
        };
      });

      return res.status(201).json({
        message: "Member Saved Successfully",
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
  } else if (req.method === "PUT") {
    try {
      const { id, first_name, tags, role, created_by } = req.body;

      let createdUserData = await prisma.user.findUnique({
        where: { id: created_by },
      });

      const transactionData = await prisma.$transaction(async (transaction) => {
        let existingData = await transaction.user.findUnique({
          where: { id: id },
        });

        let existingOrgUser =
          await transaction.userOraganizationGroups.findMany({
            where: {
              AND: [
                { user_id: existingData.id },
                { organization_id: createdUserData.organization_id },
              ],
            },
          });

        let userData = {};

        if (existingOrgUser.length > 0) {
          userData = await transaction.user.update({
            where: { id: id },
            data: {
              first_name: first_name,
            },
          });

          await transaction.userOraganizationGroups.update({
            where: { id: existingOrgUser[0].id },
            data: {
              role_id: role,
              tags: tags,
            },
          });
        } else {
          userData = null;
        }

        let organizationTags = await prisma.userOraganizationTags.findMany({
          where: { organization_id: createdUserData.organization_id },
        });

        let newTags = [];
        if (organizationTags.length > 0) {
          newTags = tags.filter((item) => {
            return !organizationTags.find((data) => {
              return data.tag_name === item;
            });
          });
        } else {
          newTags = tags;
        }
        if (newTags.length > 0) {
          let tagsData = [];

          newTags.forEach((item) => {
            tagsData.push({
              user: { connect: { id: createdUserData.id } },
              tag_name: item,
              organization: {
                connect: { id: createdUserData.organization_id },
              },
            });
          });

          tagsData.map(async (item) => {
            return await prisma.userOraganizationTags.create({
              data: item,
            });
          });
        }

        return {
          userData,
        };
      });

      if (transactionData.userData) {
        return res.status(200).json({
          message: "Members Updated Successfully.",
          status: 200,
          data: transactionData.userData,
        });
      } else {
        return res.status(500).json({ error: 500, message: "No record Found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = req.body;

    if (reqBody.email) {
      let existingData = await prisma.user.findUnique({
        where: { email: reqBody.email },
      });
      let createdUserData = await prisma.user.findUnique({
        where: { id: reqBody.created_by },
      });

      let existingOrgUser = await prisma.userOraganizationGroups.findFirst({
        where: {
          AND: [
            { user_id: existingData.id },
            { organization_id: createdUserData.organization_id },
          ],
        },
      });

      if (existingOrgUser) {
        await prisma.userOraganizationGroups.delete({
          where: { id: existingOrgUser.id },
        });

        return res.status(200).json({
          status: 200,
          message: "Member Deleted Successfully.",
        });
      }

      return res.status(400).json({
        status: 400,
        message: "Failed To Delete Record.",
      });
    }
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST", "PUT", "DELETE"],
    protectedRoute: true,
    schemaObj: MEMBER_SCHEMA,
  });

export default functionHandle;

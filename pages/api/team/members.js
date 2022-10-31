import { hashedPassword } from "../../../lib/auth";
import { mailService, mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    try {
      const resData = req.body;

      let existingData = await prisma.user.findUnique({
        where: { email: resData.email },
      });
      let createdUserData = await prisma.user.findUnique({
        where: { id: resData.created_by },
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
          return res
            .status(409)
            .json({ error: "409", message: "Duplicate Employee" });
        }
      }

      const transactionData = await prisma.$transaction(async (transaction) => {
        let userobj = {
          email: resData.email,
          // password: await hashedPassword(password),
          first_name: resData.first_name,
          last_name: resData.last_name ?? "",
          status: resData.status,
          role: { connect: { id: resData.role } },
          organization: { connect: { id: createdUserData.organization_id } },
        };

        let existingUser = await transaction.user.findUnique({
          where: { email: resData.email },
        });
        let userData = {};
        let passwordResetData = {};

        if (existingUser) {
          userData = await transaction.userOraganizationGroups.create({
            data: {
              user: { connect: { id: existingUser.id } },
              role: { connect: { id: resData.role } },
              organization: {
                connect: { id: createdUserData.organization_id },
              },
              status: true,
              tags: resData.tags,
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
            let userOrgData = await transaction.userOraganizationGroups.create({
              data: {
                user: { connect: { id: userData.id } },
                role: { connect: { id: resData.role } },
                organization: {
                  connect: { id: createdUserData.organization_id },
                },
                status: true,
                tags: resData.tags,
              },
            });

            let userDeatilsTable = await transaction.userDetails.create({
              data: {
                user: { connect: { id: userData.id } },
              },
            });
          }
          passwordResetData = await transaction.passwordReset.create({
            data: {
              email: { connect: { email: userData.email } },
              created_by: { connect: { id: resData.created_by } },
              token: await hashedPassword(resData.email),
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
          newTags = resData.tags.filter((item) => {
            return !organizationTags.find((data) => {
              return data.tag_name === item;
            });
          });
        } else {
          newTags = resData.tags;
        }
        if (newTags.length > 0) {
          let tagsData = [];

          let multipleTags = newTags.forEach((item) => {
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
  } else if (req.method === "GET") {
    return;
  } else if (req.method === "PUT") {
    try {
      const resData = req.body;

      let createdUserData = await prisma.user.findUnique({
        where: { id: resData.created_by },
      });

      const transactionData = await prisma.$transaction(async (transaction) => {
        let existingData = await transaction.user.findUnique({
          where: { email: resData.email },
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
            where: { email: resData.email },
            data: {
              first_name: resData.first_name,
            },
          });
          const userOrgData = await transaction.userOraganizationGroups.update({
            where: { id: existingOrgUser[0].id },
            data: {
              role_id: resData.role,
              tags: resData.tags,
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
          newTags = resData.tags.filter((item) => {
            return !organizationTags.find((data) => {
              return data.tag_name === item;
            });
          });
        } else {
          newTags = resData.tags;
        }
        if (newTags.length > 0) {
          let tagsData = [];

          let multipleTags = newTags.forEach((item) => {
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
        const deleteData = await prisma.userOraganizationGroups.delete({
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
  RequestHandler(req, res, handle, ["POST", "GET", "PUT", "DELETE"]);

export default functionHandle;

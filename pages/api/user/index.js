import { ADMIN_ROLE, USER_STATUS_TYPE } from "../../../constants";
import { hashedPassword } from "../../../lib/auth";
import { mailService, mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";
import { USER_SCHEMA } from "../../../yup-schema/user";

const BASE_URL = process.env.NEXT_APP_URL;
const SMTP_USER = process.env.SMTP_USER;

async function handle(req, res, prisma) {
  const { first_name, company_name, email, password } = req.body;

  const orgData = await prisma.userOrganization.findUnique({
    where: {
      company_name: company_name,
    },
  });

  if (orgData)
    return res.status(400).json({ message: "Duplicate company name" });

  const emailRegistered = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (emailRegistered)
    return res.status(400).json({
      message: "User with email id already exists in other organization!",
    });

  const transactionData = await prisma.$transaction(async (transaction) => {
    const organization = await transaction.userOrganization.create({
      data: {
        company_name: company_name,
      },
    });

    if (organization.id) {
      let userobj = {
        email: email,
        password: await hashedPassword(password),
        first_name: first_name,
        last_name: "",
        status: USER_STATUS_TYPE.ACTIVE,
        role: { connect: { id: ADMIN_ROLE } },
        organization: { connect: { id: organization.id } },
      };

      const savedData = await transaction.user.create({
        data: userobj,
      });

      await transaction.userOraganizationGroups.create({
        data: {
          user: { connect: { id: savedData.id } },
          role: { connect: { id: ADMIN_ROLE } },
          organization: {
            connect: { id: organization.id },
          },
          status: true,
        },
      });

      await transaction.userDetails.create({
        data: {
          user: { connect: { id: savedData.id } },
        },
      });

      return {
        savedData,
      };
    }
  });

  if (transactionData && transactionData.savedData) {
    const mailData = {
      from: SMTP_USER,
      to: transactionData.savedData.email,
      subject: `Successfully Registered on Desk Chime`,

      html: mailTemplate({
        body: `You have successfully registered on Desk Chime. Please login to get started.`,
        name: transactionData.savedData.first_name,
        btnLink: `${BASE_URL}/auth/login`,
        btnText: "Get Started",
      }),
    };

    await mailService.sendMail(mailData);

    return res.status(201).json({
      message: "User register successfully",
      data: transactionData.savedData,
    });
  }
  return res.status(400).json({
    message: "User not register.",
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: false,
    schemaObj: USER_SCHEMA,
  });

export default functionHandle;

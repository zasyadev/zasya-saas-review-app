import { hashedPassword } from "../../../lib/auth";
import { mailService, mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";
import { USER_SCHEMA } from "../../../yup-schema/user";

const DEFAULT_USER_ROLE = 2;
const DEFAULT_USER_STATUS = 1;

async function handle(req, res, prisma) {
  const { first_name, company_name, email, password } = req.body;

  const orgData = await prisma.userOrganization.findUnique({
    where: {
      company_name: company_name,
    },
  });

  if (orgData) {
    return res
      .status(400)
      .json({ error: "error", message: "Duplicate Company Name" });
  }

  const emailRegistered = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (emailRegistered) {
    return res.status(400).json({
      error: "error",
      message: "User with email id already exists in other organization!",
    });
  }

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

        status: DEFAULT_USER_STATUS,
        role: { connect: { id: DEFAULT_USER_ROLE } },
        organization: { connect: { id: organization.id } },
      };

      const savedData = await transaction.user.create({
        data: userobj,
      });

      await transaction.userOraganizationGroups.create({
        data: {
          user: { connect: { id: savedData.id } },
          role: { connect: { id: DEFAULT_USER_ROLE } },
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

  const mailData = {
    from: process.env.SMTP_USER,
    to: transactionData.savedData.email,
    subject: `Successfully Registered on Review App`,

    html: mailTemplate({
      body: `You have successfully registered on Review App. Please login to get started.`,
      name: transactionData.savedData.first_name,
      btnLink: `${process.env.NEXT_APP_URL}/auth/login`,
      btnText: "Get Started",
    }),
  };

  await mailService.sendMail(mailData, function (err, info) {
    // if (err) console.log("failed");
    // else console.log("successfull");
  });

  return res.status(201).json({
    message: "User Register Successfully",
    data: transactionData.savedData,
    status: 200,
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: true,
    schemaObj: USER_SCHEMA,
  });

export default functionHandle;

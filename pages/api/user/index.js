import { hashedPassword } from "../../../lib/auth";
import { mailService, mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const userData = req.body;
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

        let userDeatilsTable = await transaction.userDetails.create({
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
  } catch (error) {
    if (error.code == "P2002") {
      return res
        .status(500)
        .json({ error: error, message: "Duplicate Email Address" });
    }
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
}

const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

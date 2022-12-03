import { RequestHandler } from "../../../lib/RequestHandler";
import { UPDATE_PROFILE_SCHEMA } from "../../../yup-schema/user";

async function handle(req, res, prisma) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    const userData = await prisma.userDetails.findUnique({
      where: { user_id: user_id },
      include: {
        user: {
          select: {
            first_name: true,
            organization: true,
            role: true,
            email: true,
          },
        },
      },
    });

    if (userData) {
      return res.status(200).json({
        status: 200,
        data: userData,
        message: "All Data Retrieved",
      });
    }

    return res
      .status(404)
      .json({ status: 404, message: "No User Details Found" });
  } else if (req.method === "POST") {
    const {
      first_name,
      address1,
      address2,
      about,
      mobile,
      imageName,
      notification,
    } = req.body;

    if (first_name) {
      const transactionData = await prisma.$transaction(async (transaction) => {
        await transaction.user.update({
          where: { id: user_id },
          data: {
            first_name: first_name,
          },
        });

        const userDetailData = await transaction.userDetails.findUnique({
          where: { user_id: user_id },
        });

        let userDeatilsTable = {};
        if (userDetailData) {
          let dataObj = {
            address1: address1 ?? "",
            address2: address2 ?? "",
            about: about ?? "",
            pin_code: "",
            mobile: mobile ?? "",
            image: imageName ?? "",
            notification: notification ?? [],
          };

          userDeatilsTable = await transaction.userDetails.update({
            where: { id: userDetailData.id },
            data: dataObj,
          });
        } else {
          userDeatilsTable = await transaction.userDetails.create({
            data: {
              user: { connect: { id: user_id } },
              image: imageName ?? "",
              address1: address1 ?? "",
              address2: address2 ?? "",
              about: about ?? "",
              pin_code: pin_code ?? "",
              mobile: mobile ?? "",
              notification: notification ?? [],
            },
          });
        }

        return { userDeatilsTable };
      });

      if (transactionData.userDeatilsTable) {
        return res.status(201).json({
          message: "Profile Updated Successfully",
          data: transactionData.userDeatilsTable,
          status: 200,
        });
      }
    } else {
      return res.status(400).json({
        message: "User Not Found",

        status: 400,
      });
    }
  }
}
const functionHandle = (req, res) =>
  RequestHandler(req, res, handle, ["GET", "POST"], UPDATE_PROFILE_SCHEMA);

export default functionHandle;

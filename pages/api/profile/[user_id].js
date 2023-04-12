import moment from "moment";
import { RequestHandler } from "../../../lib/RequestHandler";
import { UPDATE_PROFILE_SCHEMA } from "../../../yup-schema/user";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";

async function handle(req, res, prisma, user) {
  const { user_id } = req.query;
  const { organization_id } = user;
  const currentMonth = {
    lte: moment().endOf("month").format(),
    gte: moment().startOf("month").format(),
  };

  if (!user_id) throw BadRequestException("No User found");

  if (req.method === "GET") {
    const queryCondition = {
      AND: [
        { organization_id: organization_id },
        { created_date: currentMonth },
      ],
    };

    const userData = await prisma.userDetails.findUnique({
      where: { user_id: user_id },
      include: {
        user: {
          select: {
            first_name: true,
            organization: true,
            role: true,
            email: true,
            Goals: {
              where: { AND: [...queryCondition.AND, { is_archived: false }] },
            },
            userCreated: {
              where: queryCondition,
            },

            taskReviewBy: {
              where: queryCondition,
            },
            Meetings: {
              where: queryCondition,
            },
          },
        },
      },
    });
    if (!userData) throw BadRequestException("No User Details Found");

    return res.status(200).json({
      data: userData,
      message: "All Data Retrieved",
    });
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
    if (!transactionData && !transactionData.userDeatilsTable)
      throw BadRequestException("Profile Not Updated");
    return res.status(201).json({
      message: "Profile Updated Successfully",
      data: transactionData.userDeatilsTable,
    });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "POST"],
    protectedRoute: true,
    schemaObj: UPDATE_PROFILE_SCHEMA,
  });

export default functionHandle;

import { activityTitle, ACTIVITY_TYPE_ENUM } from "../../../constants";
import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";
import { APPLAUD_SCHEMA } from "../../../yup-schema/applaud";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  try {
    const reqBody = req.body;
    const { id: userId } = user;

    const userData = await prisma.user.findUnique({
      where: { id: reqBody.user_id },
      include: {
        UserDetails: true,
      },
    });
    const createdData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData && !createdData)
      throw new BadRequestException("User not found.");

    const data = await prisma.userApplaud.create({
      data: {
        user: { connect: { id: reqBody.user_id } },
        comment: reqBody.comment,
        category: reqBody.category,
        created: { connect: { id: userId } },
        organization: { connect: { id: userData.organization_id } },
      },
    });

    if (data) {
      let notificationMessage = {
        message: `${createdData.first_name ?? ""} has applauded you`,
        link: `${BASE_URL}applaud`,
      };

      await prisma.userNotification.create({
        data: {
          user: { connect: { id: reqBody.user_id } },
          data: notificationMessage,
          read_at: null,
          organization: {
            connect: { id: userData.organization_id },
          },
        },
      });

      let activityData = {
        type: ACTIVITY_TYPE_ENUM.APPLAUD,
        description: data.comment,
        link: notificationMessage.link,
        type_id: data.id,
        organization_id: userData.organization_id,
      };

      await prisma.userActivity.createMany({
        data: [
          {
            ...activityData,
            user_id: reqBody.user_id,
            title: activityTitle(
              ACTIVITY_TYPE_ENUM.APPLAUD,
              createdData.first_name
            ),
          },
          {
            ...activityData,
            user_id: userId,
            title: activityTitle(
              ACTIVITY_TYPE_ENUM.APPLAUDGIVEN,
              userData.first_name
            ),
          },
        ],
      });

      if (
        userData.UserDetails &&
        userData.UserDetails?.notification &&
        userData.UserDetails?.notification?.length &&
        userData.UserDetails?.notification.includes("slack")
      ) {
        if (userData.UserDetails.slack_id) {
          let customText = CustomizeSlackMessage({
            header: "New Applaud Recieved",
            user: createdData.first_name ?? "",
            link: `${BASE_URL}applaud`,
            by: "Applauded By",
            text: reqBody.comment,
          });
          SlackPostMessage({
            channel: userData.UserDetails.slack_id,
            text: `${createdData.first_name ?? ""} has applauded you`,
            blocks: customText,
          });
        }
      }
    }

    return res.status(201).json({
      message: "Applaud sent successfully",
      data: data,
    });
  } catch (error) {
    console.log({ error });
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: true,
    schemaObj: APPLAUD_SCHEMA,
  });

export default functionHandle;

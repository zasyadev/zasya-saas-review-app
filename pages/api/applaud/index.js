import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { APPLAUD_SCHEMA } from "../../../yup-schema/applaud";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  if (req.method === "POST") {
    try {
      const reqBody = req.body;
      const { id: userId } = user;

      let userData = await prisma.user.findUnique({
        where: { id: reqBody.user_id },
        include: {
          UserDetails: true,
        },
      });
      let createdData = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (userData && createdData) {
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
          if (
            userData?.UserDetails &&
            userData?.UserDetails?.notification &&
            userData?.UserDetails?.notification?.length &&
            userData?.UserDetails?.notification.includes("slack")
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
          message: "Saved  Successfully",
          data: data,
          status: 200,
        });
      } else {
        return res
          .status(402)
          .json({ error: "error", message: "User Not Found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
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

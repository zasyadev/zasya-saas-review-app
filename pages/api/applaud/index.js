import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import prisma from "../../../lib/prisma";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res) {
  if (req.method === "POST") {
    try {
      const reqBody = req.body;

      let userData = await prisma.user.findUnique({
        where: { id: reqBody.user_id },
        include: {
          UserDetails: true,
        },
      });
      let createdData = await prisma.user.findUnique({
        where: { id: reqBody.created_by },
      });

      if (userData && createdData) {
        const data = await prisma.userApplaud.create({
          data: {
            user: { connect: { id: reqBody.user_id } },
            comment: reqBody.comment,
            created: { connect: { id: reqBody.created_by } },
            organization: { connect: { id: userData.organization_id } },
          },
        });

        if (data) {
          let notificationMessage = {
            message: `${createdData.first_name ?? ""} has applauded you`,
            link: `${process.env.NEXT_APP_URL}applaud`,
          };

          let notificationData = await prisma.userNotification.create({
            data: {
              user: { connect: { id: reqBody.user_id } },
              data: notificationMessage,
              read_at: null,
              organization: {
                connect: { id: userData.organization_id },
              },
            },
          });

          if (userData.UserDetails.slack_id) {
            let customText = CustomizeSlackMessage({
              header: "New Applaud Recieved",
              user: createdData.first_name ?? "",
              link: `${process.env.NEXT_APP_URL}applaud`,
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
  } else if (req.method === "GET") {
    try {
      const data = await prisma.userApplaud.findMany({
        include: { user: true, created: true },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Applaud Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const reqBody = JSON.parse(req.body);

      const data = await prisma.userApplaud.update({
        where: { id: reqBody.id },
        data: {
          user_id: reqBody.user_id,
          comment: reqBody.comment,
          created_by: reqBody.created_by,
        },
      });
      prisma.$disconnect();
      if (data) {
        return res.status(201).json({
          message: "Saved  Successfully",
          data: data,
          status: 200,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const deletaData = await prisma.userApplaud.delete({
        where: { id: reqBody.id },
      });

      prisma.$disconnect();
      if (deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Form Deleted Successfully.",
        });
      }
      return res.status(400).json({
        status: 400,
        message: "Failed To Delete Record.",
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
}

export default (req, res) =>
  RequestHandler(req, res, handle, ["POST", "GET", "PUT", "DELETE"]);

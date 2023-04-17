import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { mailTemplate, mailService } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma, user) {
  try {
    const { reviewId, assignedIds } = req.body;
    const { id: userId } = user;

    if (!assignedIds && assignedIds.length <= 0)
      throw BadRequestException("Assignee(s) are required");

    assignedIds.forEach(async (item) => {
      await prisma.reviewAssignee.create({
        data: {
          review: { connect: { id: reviewId } },
          assigned_to: { connect: { id: item } },
        },
      });
    });

    const assignedToData = await prisma.user.findMany({
      where: { id: { in: assignedIds } },
      include: { UserDetails: true },
    });

    const assignedFromData = await prisma.user.findUnique({
      where: { id: userId },
    });

    assignedToData.forEach(async (user) => {
      const assigneeData = await prisma.reviewAssignee.findFirst({
        where: {
          review_id: reviewId,
          assigned_to_id: user.id,
        },
      });

      let notificationMessage = {
        message: `${assignedFromData.first_name} has assigned you New Review.`,
        link: `${BASE_URL}review/id/${assigneeData.id}`,
      };

      await prisma.userNotification.create({
        data: {
          user: { connect: { id: user.id } },
          data: notificationMessage,
          read_at: null,
          organization: {
            connect: { id: assignedFromData.organization_id },
          },
        },
      });

      if (user?.UserDetails?.notification?.length > 0) {
        if (user?.UserDetails?.notification.includes("mail")) {
          const mailData = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `New review assigned by ${assignedFromData.first_name}`,
            html: mailTemplate({
              body: `Will you take a moment to complete this review assigned by <b>${assignedFromData.first_name}</b>.`,
              name: user.first_name,
              btnLink: `${BASE_URL}review/id/${assigneeData.id}`,
              btnText: "Get Started",
            }),
          };

          await mailService.sendMail(mailData);
        }
        if (user?.UserDetails?.notification.includes("slack")) {
          if (user.UserDetails.slack_id) {
            let customText = CustomizeSlackMessage({
              header: "New Review Recieved",
              user: assignedFromData.first_name ?? "",
              link: `${BASE_URL}review/id/${assigneeData.id}`,
              by: "Review Assigned By",
            });

            SlackPostMessage({
              channel: user.UserDetails.slack_id,
              text: `${assignedFromData.first_name} has assigned you New Review.`,
              blocks: customText,
            });
          }
        }
      }
    });

    return res.status(201).json({
      message: "Review Updated Successfully",
    });
  } catch (error) {
    throw BadRequestException("Internal Server Error");
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: true,
  });
export default functionHandle;

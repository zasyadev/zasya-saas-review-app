import {
  CustomizeSlackMessage,
  SlackPostMessage,
} from "../../../helpers/slackHelper";
import { mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const { reviewId, assignedIds, userId } = req.body;

    if (Number(assignedIds?.length) > 0) {
      assignedIds.forEach(async (item) => {
        let newData = await prisma.reviewAssignee.create({
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
          link: `${process.env.NEXT_APP_URL}review/id/${assigneeData.id}`,
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

        if (Number(user?.UserDetails?.notification?.length) > 0) {
          if (user?.UserDetails?.notification.includes("mail")) {
            const mailData = {
              from: process.env.SMTP_USER,
              to: user.email,
              subject: `New review assigned by ${assignedFromData.first_name}`,
              html: mailTemplate({
                body: `Will you take a moment to complete this review assigned by <b>${assignedFromData.first_name}</b>.`,
                name: user.first_name,
                btnLink: `${process.env.NEXT_APP_URL}review/id/${assigneeData.id}`,
                btnText: "Get Started",
              }),
            };

            await mailService.sendMail(mailData, function (err, info) {
              // if (err) console.log("failed");
              // else console.log("successfull");
            });
          }
          if (user?.UserDetails?.notification.includes("slack")) {
            if (user.UserDetails.slack_id) {
              let customText = CustomizeSlackMessage({
                header: "New Review Recieved",
                user: assignedFromData.first_name ?? "",
                link: `${process.env.NEXT_APP_URL}review/id/${assigneeData.id}`,
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
        status: 200,
      });
    } else {
      return res.status(500).json({
        error: "Assignee id(s) are required",
        message: "Assignee id(s) are required",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

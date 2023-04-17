import { RequestHandler } from "../../../../lib/RequestHandler";
import { SlackUserList } from "../../../../helpers/slackHelper";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";

async function handle(req, res, prisma) {
  const { userId } = req.query;
  const reqBody = req.body;

  const userDetails = await prisma.userDetails.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (userDetails?.slack_email === reqBody.slack_email)
    throw BadRequestException(
      "The new email you have entered is same as your old email."
    );

  let slackUserList = await SlackUserList();

  let valid_slack_email = "";
  let valid_slack_id = "";

  if (reqBody.slack_email && slackUserList.length) {
    let slackDetails = slackUserList.find((item) =>
      item.profile.email ? item.profile.email == reqBody.slack_email : false
    );

    if (!slackDetails) throw BadRequestException("Email Not Found");

    valid_slack_email = slackDetails.profile.email;
    valid_slack_id = slackDetails.id;
    const userDetailData = await prisma.userDetails.update({
      where: { user_id: userId },
      data: {
        slack_email: valid_slack_email,
        slack_id: valid_slack_id,
      },
    });
    if (!userDetailData) throw BadRequestException("Email Not Saved");

    return res.status(200).json({
      message: "Slack Email Updated Succesfully.",
    });
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

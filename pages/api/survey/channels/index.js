import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    const { surveyId, userId } = req.body;

    if (!surveyId && !userId) {
      return res.status(401).json({ status: 401, message: "No Survey found" });
    }
    const surveyData = await prisma.survey.findFirst({
      where: { AND: [{ id: surveyId }, { created_by: userId }] },
      include: {
        SurveyChannels: true,
      },
    });

    if (!surveyData) {
      res.status(400).json({
        status: 400,
        message: "No Data Found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: surveyData,
      message: "Survey Details Retrieved",
    });
  } else if (req.method === "PUT") {
    const { channelId, userId, status } = req.body;

    if (!channelId && !userId) {
      return res.status(401).json({ status: 401, message: "No Survey found" });
    }
    const surveyChannelData = await prisma.surveyChannels.update({
      where: { id: channelId },
      data: {
        status: status,
      },
    });

    if (!surveyChannelData) {
      res.status(400).json({
        status: 400,
        message: "No Data Found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: surveyChannelData,
      message: "Status changed successfully  ",
    });
  } else if (req.method === "DELETE") {
    const { channelId, userId } = req.body;

    if (!channelId && !userId) {
      return res.status(401).json({ status: 401, message: "No Survey found" });
    }
    const surveyChannelData = await prisma.surveyChannels.findUnique({
      where: { id: channelId },
    });
    if (!surveyChannelData) {
      res.status(400).json({
        status: 400,
        message: "No Data Found",
      });
    }
    if (surveyChannelData.isDefault) {
      res.status(200).json({
        status: 401,
        message: "Channel is default.",
      });
    } else {
      const deleteChannel = await prisma.surveyChannels.delete({
        where: { id: surveyChannelData.id },
      });
      if (!deleteChannel) {
        res.status(400).json({
          status: 400,
          message: "No Data Found",
        });
      } else {
        return res.status(200).json({
          status: 200,
          message: "Channel deleted successfully  ",
        });
      }
    }
  }
}
const functionHandle = (req, res) =>
  RequestHandler(req, res, handle, ["POST", "PUT", "DELETE"]);
export default functionHandle;

import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  if (!userId) throw new BadRequestException("No user found");

  if (req.method === "POST") {
    const { surveyId } = req.body;

    if (!surveyId) throw new BadRequestException("No survey found");

    const surveyData = await prisma.survey.findFirst({
      where: { AND: [{ id: surveyId }, { created_by: userId }] },
      include: {
        SurveyChannels: {
          include: {
            SurveyChannelUser: true,
          },
        },
      },
    });

    if (!surveyData) throw new BadRequestException("No survey found");

    return res.status(200).json({
      data: surveyData,
      message: "Survey Details Retrieved",
    });
  } else if (req.method === "PUT") {
    const { channelId, status } = req.body;

    if (!channelId) throw new BadRequestException("No survey found");

    const surveyChannelData = await prisma.surveyChannels.update({
      where: { id: channelId },
      data: {
        status: status,
      },
    });

    if (!surveyChannelData) throw new BadRequestException("No data found");

    return res.status(200).json({
      data: surveyChannelData,
      message: "Status changed successfully  ",
    });
  } else if (req.method === "DELETE") {
    const { channelId } = req.body;

    if (!channelId) throw new BadRequestException("No survey found");

    const surveyChannelData = await prisma.surveyChannels.findUnique({
      where: { id: channelId },
    });
    if (!surveyChannelData) throw new BadRequestException("No data found");

    if (surveyChannelData.isDefault) {
      res.status(200).json({
        message: "Channel is default.",
      });
    } else {
      const deleteChannel = await prisma.surveyChannels.delete({
        where: { id: surveyChannelData.id },
      });
      if (!deleteChannel) throw new BadRequestException("No data found");
      else {
        return res.status(200).json({
          message: "Channel deleted successfully  ",
        });
      }
    }
  }
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST", "PUT", "DELETE"],
    protectedRoute: true,
  });

export default functionHandle;

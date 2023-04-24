import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    const { urlId } = req.body;
    let surveyData = {};

    if (urlId && urlId.indexOf("rvc-") === 0) {
      let originalId = urlId.replace("rvc-", "");

      const data = await prisma.surveyChannelUser.findFirst({
        where: { customer_url: originalId },
        include: {
          channel: true,
        },
      });
      if (!data) throw new BadRequestException("No Record Found");

      if (!data.channel.status) {
        return res.status(200).json({
          status: 403,
          message: "Survey is Inactive",
        });
      }
      if (data.status === "Answered") {
        return res.status(200).json({
          status: 402,
          message: "Survey is already Answered",
        });
      }

      if (data.status !== "Opened") {
        await prisma.surveyChannelUser.update({
          where: { id: data.id },
          data: {
            status: "Opened",
          },
        });
      }
      if (data.channel && data.channel.survey_id) {
        surveyData = await prisma.survey.findFirst({
          where: { id: data.channel.survey_id },
          include: {
            SurveyQuestions: {
              include: {
                SurveyQuestionOption: true,
              },
            },
          },
        });
      }
    } else {
      const data = await prisma.surveyChannels.findFirst({
        where: { url: urlId },
      });

      if (data) {
        if (!data.status) {
          return res.status(200).json({
            status: 403,
            message: "Survey is Inactive",
          });
        }

        surveyData = await prisma.survey.findFirst({
          where: { id: data.survey_id },
          include: {
            SurveyQuestions: {
              include: {
                SurveyQuestionOption: true,
              },
            },
          },
        });
      }
    }

    if (!surveyData) throw new BadRequestException("No data found");

    return res.status(200).json({
      data: surveyData,
      message: "Survey Details Retrieved",
    });
  }

  if (req.method === "DELETE") {
    const { id, userId } = req.body;

    const data = await prisma.survey.findFirst({
      where: { id: id },
    });
    if (data.created_by === userId) {
      const deleteSurvey = await prisma.survey.delete({
        where: {
          id: id,
        },
      });
      if (!deleteSurvey) throw new BadRequestException("Survey not deleted");

      return res.status(200).json({
        data: deleteSurvey,
        message: "Survey Details Delete",
      });
    }
  }
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST", "DELETE"],
    protectedRoute: false,
  });

export default functionHandle;

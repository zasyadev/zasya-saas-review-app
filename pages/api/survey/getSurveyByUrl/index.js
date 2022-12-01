import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    const { urlId } = req.body;
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

      const surveyData = await prisma.survey.findFirst({
        where: { id: data.survey_id },
        include: {
          SurveyQuestions: {
            include: {
              SurveyQuestionOption: true,
            },
          },
        },
      });
      if (!surveyData) {
        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }

      return res.status(200).json({
        status: 200,
        data: surveyData,
        message: "Survey Details Retrieved",
      });
    }

    return res.status(404).json({ status: 404, message: "No Record Found" });
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
      if (deleteSurvey) {
        return res.status(200).json({
          status: 200,
          data: deleteSurvey,
          message: "Survey Details Delete",
        });
      }
    }
  }
}

const functionHandle = (req, res) =>
  RequestHandler(req, res, handle, ["POST", "DELETE"]);

export default functionHandle;

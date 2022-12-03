import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { surveyId, userId } = req.body;

  if (!surveyId && !userId) {
    return res.status(401).json({ status: 401, message: "No Survey found" });
  }

  const surveyData = await prisma.survey.findFirst({
    where: { AND: [{ id: surveyId }, { created_by: userId }] },
    include: {
      SurveyQuestions: true,
      SurveyAnswers: {
        include: { SurveyAnswerOption: true },
      },
      SurveyChannels: {
        include: { SurveyChannelUser: true },
      },
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
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

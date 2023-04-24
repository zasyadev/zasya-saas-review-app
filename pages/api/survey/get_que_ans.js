import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { surveyId } = req.body;
  const { id: userId } = user;

  if (!surveyId && !userId) throw new BadRequestException("No survey found");

  const surveyData = await prisma.survey.findFirst({
    where: { AND: [{ id: surveyId }, { created_by: userId }] },
    include: {
      SurveyQuestions: {
        include: { SurveyQuestionOption: true },
      },
      SurveyAnswers: {
        include: { SurveyAnswerOption: true },
      },
      SurveyChannels: {
        include: { SurveyChannelUser: true },
      },
    },
  });

  if (!surveyData) throw new BadRequestException("No data found");

  return res.status(200).json({
    data: surveyData,
    message: "Survey Details Retrieved",
  });
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

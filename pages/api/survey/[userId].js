import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;
  if (!userId) throw new BadRequestException("No user found");

  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });
  const data = await prisma.survey.findMany({
    orderBy: {
      modified_date: "desc",
    },
    where: {
      AND: [
        { created_by: userId },
        { organization_id: userData.organization_id },
      ],
    },
    include: {
      SurveyQuestions: true,
      _count: {
        select: { SurveyAnswers: true },
      },
    },
  });
  if (!data) throw new BadRequestException("No user found");

  return res.status(200).json({
    data: data,
    message: "Survey Details Retrieved",
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: false,
  });

export default functionHandle;

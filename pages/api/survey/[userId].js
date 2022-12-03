import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
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

  if (data) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Survey Details Retrieved",
    });
  }
  return res.status(404).json({ status: 404, message: "No Record Found" });
}

const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);

export default functionHandle;

import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { urlId } = req.body;

  const data = await prisma.survey.findFirst({
    where: {
      url_id: urlId,
    },

    include: {
      SurveyQuestions: {
        include: {
          SurveyQuestionOption: true,
        },
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

const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);

export default functionHandle;

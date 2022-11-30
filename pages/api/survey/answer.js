import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const reqBody = req.body;

    const transactionData = await prisma.$transaction(async (transaction) => {
      const answerData = reqBody.answerValue.map((value) => {
        return {
          question: { connect: { id: value.questionId } },
          option: value.answer,
        };
      });
      console.log(answerData);
      const formdata = await transaction.surveyAnswers.create({
        data: {
          survey: { connect: { id: reqBody.survey_id } },
          created_survey_date: reqBody.created_survey_date,
          SurveyAnswerOption: {
            create: answerData,
          },
        },
      });
      return { formdata };
    });

    if (!transactionData.formdata || !transactionData) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error!",
        data: {},
      });
    }

    return res.status(201).json({
      message: "Review Saved Sucessfully.",
      data: transactionData.formdata,
      status: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

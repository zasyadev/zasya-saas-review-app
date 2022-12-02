import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const { answerValue, survey_id, created_survey_date, urlId } = req.body;
    if (!answerValue && !survey_id && !created_survey_date && !urlId) {
      return res.status(400).json({
        message: "Bad Request! All fields are required",
      });
    }
    if (Number(answerValue?.length) === 0) {
      return res.status(400).json({
        message: "Bad Request! All answers are required",
      });
    }

    const transactionData = await prisma.$transaction(async (transaction) => {
      let formdata = {};

      const answerData = answerValue.map((value) => {
        return {
          question: { connect: { id: value.questionId } },
          option: value.answer,
        };
      });

      let name = "Anonymous";
      let surveyUserData = null;
      if (urlId && urlId.indexOf("rvc-") === 0) {
        surveyUserData = await transaction.surveyChannelUser.findFirst({
          where: { customer_url: urlId.replace("rvc-", "") },
        });

        if (surveyUserData) {
          name =
            surveyUserData?.name?.indexOf("@") > -1 &&
            Number(surveyUserData?.name?.split("@")?.length) > 0
              ? surveyUserData?.name.split("@")[0]
              : "";

          await transaction.surveyChannelUser.update({
            where: { id: surveyUserData.id },
            data: {
              status: "Answered",
            },
          });
        }
      }

      formdata = await transaction.surveyAnswers.create({
        data: {
          survey: { connect: { id: survey_id } },
          created_survey_date: created_survey_date,
          name: name,
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
      message: "Survey Answered Sucessfully.",
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

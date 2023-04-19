import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const { answerValue, survey_id, created_survey_date, urlId } = req.body;
    if (!answerValue && !survey_id && !created_survey_date && !urlId)
      throw new BadRequestException("Bad Request! All fields are required");

    if (Number(answerValue?.length) === 0)
      throw new BadRequestException("Bad Request! All answers are required");

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

    if (!transactionData.formdata || !transactionData)
      throw new BadRequestException("Internal server error");

    return res.status(200).json({
      message: "Survey Answered Sucessfully.",
      data: transactionData.formdata,
    });
  } catch (error) {
    throw new BadRequestException("Internal server error");
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST"],
    protectedRoute: false,
  });

export default functionHandle;

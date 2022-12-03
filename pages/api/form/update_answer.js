import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const resData = req.body;
    let isUpdateRecord = false;
    const transactionData = await prisma.$transaction(async (transaction) => {
      const answerData = {
        question: { connect: { id: resData.questionId } },
        option: resData.answer,
      };

      const userTableData = await transaction.user.findUnique({
        where: { id: resData.user_id },
      });

      const findReviewAlreadyAnswered =
        await transaction.reviewAssigneeAnswers.findFirst({
          where: {
            AND: [
              { user_id: resData.user_id },
              { review_id: resData.review_id },
              { review_assignee_id: resData.review_assignee_id },
            ],
          },
        });

      if (findReviewAlreadyAnswered) {
        const findAnswerRecord =
          await transaction.ReviewAssigneeAnswerOption.findFirst({
            where: {
              AND: [
                { question_id: resData.questionId },
                { review_id: findReviewAlreadyAnswered.id },
              ],
            },
          });

        if (findAnswerRecord) {
          const updatedRecord =
            await transaction.ReviewAssigneeAnswerOption.update({
              where: {
                id: findAnswerRecord.id,
              },
              data: {
                option: resData.answer,
              },
            });

          isUpdateRecord = true;
          return { formdata: updatedRecord };
        } else {
          const createdAnswerRecord =
            await transaction.ReviewAssigneeAnswerOption.create({
              data: {
                question_id: resData.questionId,
                option: resData.answer,
                review_id: findReviewAlreadyAnswered.id,
              },
            });

          return { formdata: createdAnswerRecord };
        }
      } else {
        const formdata = await transaction.reviewAssigneeAnswers.create({
          data: {
            user: { connect: { id: resData.user_id } },
            review: { connect: { id: resData.review_id } },
            review_assignee: {
              connect: { id: resData.review_assignee_id },
            },
            created_assignee_date: resData.created_assignee_date,
            organization: {
              connect: { id: userTableData.organization_id },
            },
            ReviewAssigneeAnswerOption: {
              create: answerData,
            },
          },
        });
        return { formdata };
      }
    });

    if (!transactionData.formdata) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error!",
        data: {},
      });
    }

    return res.status(201).json({
      message: `Review ${isUpdateRecord ? "Updated" : "Saved"} Sucessfully.`,
      data: transactionData.formdata,
      status: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
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

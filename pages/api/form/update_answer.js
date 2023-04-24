import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  try {
    const reqBody = req.body;
    let isUpdateRecord = false;
    const transactionData = await prisma.$transaction(async (transaction) => {
      const answerData = {
        question: { connect: { id: reqBody.questionId } },
        option: reqBody.answer,
      };

      const userTableData = await transaction.user.findUnique({
        where: { id: reqBody.user_id },
      });

      const findReviewAlreadyAnswered =
        await transaction.reviewAssigneeAnswers.findFirst({
          where: {
            AND: [
              { user_id: reqBody.user_id },
              { review_id: reqBody.review_id },
              { review_assignee_id: reqBody.review_assignee_id },
            ],
          },
        });

      if (findReviewAlreadyAnswered) {
        const findAnswerRecord =
          await transaction.ReviewAssigneeAnswerOption.findFirst({
            where: {
              AND: [
                { question_id: reqBody.questionId },
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
                option: reqBody.answer,
              },
            });

          isUpdateRecord = true;
          return { formdata: updatedRecord };
        } else {
          const createdAnswerRecord =
            await transaction.ReviewAssigneeAnswerOption.create({
              data: {
                question_id: reqBody.questionId,
                option: reqBody.answer,
                review_id: findReviewAlreadyAnswered.id,
              },
            });

          return { formdata: createdAnswerRecord };
        }
      } else {
        const formdata = await transaction.reviewAssigneeAnswers.create({
          data: {
            user: { connect: { id: reqBody.user_id } },
            review: { connect: { id: reqBody.review_id } },
            review_assignee: {
              connect: { id: reqBody.review_assignee_id },
            },
            created_assignee_date: reqBody.created_assignee_date,
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

    if (!transactionData.formdata)
      throw new BadRequestException("No record found");

    return res.status(201).json({
      message: `Review ${isUpdateRecord ? "Updated" : "Saved"} Sucessfully.`,
      data: transactionData.formdata,
    });
  } catch (error) {
    throw new BadRequestException("Internal Server Error");
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

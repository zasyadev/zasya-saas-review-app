import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { mailService, mailTemplate } from "../../../lib/emailservice";
import { RequestHandler } from "../../../lib/RequestHandler";
const BASE_URL = process.env.NEXT_APP_URL;

async function handle(req, res, prisma) {
  try {
    const resData = req.body;

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

          return {
            formdata: updatedRecord,
            review_id: findReviewAlreadyAnswered.review_id,
          };
        } else {
          const createdAnswerRecord =
            await transaction.ReviewAssigneeAnswerOption.create({
              data: {
                question_id: resData.questionId,
                option: resData.answer,
                review_id: findReviewAlreadyAnswered.id,
              },
            });

          return {
            formdata: createdAnswerRecord,
            review_id: findReviewAlreadyAnswered.review_id,
          };
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
        return { formdata, review_id: formdata.review_id };
      }
    });

    if (!transactionData.formdata || !transactionData)
      throw new BadRequestException("No record found");

    const assignedByFromData = await prisma.review.findFirst({
      where: { id: transactionData.review_id },
    });
    const assignedByUser = await prisma.user.findFirst({
      where: { id: assignedByFromData.created_by },
    });
    const assignedUser = await prisma.user.findFirst({
      where: { id: resData.user_id },
    });

    const mailData = {
      from: process.env.SMTP_USER,
      to: assignedByUser.email,
      subject: ` ${assignedUser.first_name} has filled your review`,

      html: mailTemplate({
        body: `<b>${assignedUser.first_name}</b> has filled your review.`,
        name: assignedByUser.first_name,
        btnLink: `${BASE_URL}review`,
        btnText: "See Response",
      }),
    };
    const assigneeData = await prisma.reviewAssignee.findFirst({
      where: {
        review_id: resData.review_id,
        assigned_to_id: resData.user_id,
        id: resData.review_assignee_id,
      },
    });
    await prisma.reviewAssignee.update({
      where: {
        id: assigneeData.id,
      },
      data: {
        status: "answered",
      },
    });

    await mailService.sendMail(mailData);

    return res.status(201).json({
      message: "Review Saved Sucessfully.",
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

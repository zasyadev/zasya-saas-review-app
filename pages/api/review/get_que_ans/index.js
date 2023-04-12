import { USER_SELECT_FEILDS } from "../../../../constants";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { review_id } = req.body;
  const { id: userId } = user;

  if (!review_id && !userId) throw new BadRequestException("No User found.");

  const transactionData = await prisma.$transaction(async (transaction) => {
    const questionData = await transaction.review.findFirst({
      where: { AND: [{ id: review_id }, { created_by: userId }] },
      include: {
        created: USER_SELECT_FEILDS,
        form: true,
        ReviewAssignee: {
          include: {
            assigned_to: {
              select: {
                email: true,
                first_name: true,
                id: true,
                UserDetails: {
                  select: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const answerData = await transaction.reviewAssigneeAnswers.findMany({
      where: {
        AND: {
          review_id: review_id,
          review_assignee: {
            status: "answered",
          },
        },
      },
      orderBy: { id: "desc" },
      include: {
        ReviewAssigneeAnswerOption: {
          include: { question: true },
        },
        user: {
          select: { first_name: true, last_name: true },
        },
      },
    });
    return { questionData, answerData };
  });

  if (!transactionData) throw new BadRequestException("No Review found.");

  return res.status(200).json({
    data: transactionData,
    message: "Review Details Retrieved",
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

import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { review_id } = req.body;

  if (review_id) {
    const questionData = await prisma.review.findUnique({
      where: { id: review_id },
      include: {
        created: true,
        form: true,
        ReviewAssignee: {
          include: {
            assigned_to: true,
          },
        },
      },
    });
    const answerData = await prisma.reviewAssigneeAnswers.findMany({
      where: {
        review_id: review_id,
      },
      orderBy: { id: "desc" },
      include: {
        ReviewAssigneeAnswerOption: {
          orderBy: { id: "desc" },
          include: { question: true },
        },
        user: {
          select: { first_name: true, last_name: true },
        },
      },
    });

    return res.status(200).json({
      status: 200,
      data: {
        questionData: questionData,
        answerData: answerData,
      },
      message: "Review Details Retrieved",
    });
  } else {
    return res.status(402).json({
      message: "User Not Found",
    });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);
export default functionHandle;

import { RequestHandler } from "../../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { review_id } = req.query;
  const { userId } = req.body;

  if (review_id && userId) {
    const data = await prisma.reviewAssigneeAnswers.findMany({
      where: {
        AND: [{ user_id: userId }, { review_assignee_id: review_id }],
      },
      include: {
        ReviewAssigneeAnswerOption: true,
      },
    });

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Review Details Retrieved",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

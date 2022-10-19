import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { review_id } = req.query;

  if (review_id) {
    const data = await prisma.reviewAssigneeAnswers.findMany({
      where: {
        review_id: review_id,
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

    return res.status(200).json({
      status: 200,
      data: data,
      message: "All Data Retrieved",
    });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);

export default functionHandle;

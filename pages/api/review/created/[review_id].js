import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { review_id } = req.query;
  const { userId } = req.body;

  if (review_id && userId) {
    const data = await prisma.review.findUnique({
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

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Review Details Retrieved",
    });
  } else {
    return res.status(402).json({
      message: "User Not Found",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

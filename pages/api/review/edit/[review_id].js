import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { review_id } = req.query;

  if (review_id) {
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

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Review Details Retrieved",
      });
    }

    return res.status(404).json({ status: 404, message: "No Record Found" });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["GET"]);

import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { review_id } = req.query;
  const { userId } = req.body;

  if (review_id && userId) {
    const data = await prisma.reviewAssignee.findFirst({
      where: {
        AND: [
          { id: review_id },
          {
            assigned_to_id: userId,
          },
        ],
      },
      include: {
        review: {
          include: {
            created: true,
            form: {
              include: {
                questions: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      status: 200,
      data: data,
      message: "Review Details Retrieved",
    });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);

export default functionHandle;

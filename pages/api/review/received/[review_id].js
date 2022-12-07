import { USER_SELECT_FEILDS } from "../../../../constants";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { review_id } = req.query;

  if (req.method === "POST") {
    const { id: userId } = user;
    if (!userId && !review_id) {
      return res.status(401).json({ status: 401, message: "No Record found" });
    }

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
            created: USER_SELECT_FEILDS,
            form: {
              include: {
                questions: {
                  include: { options: true },
                },
              },
            },
          },
        },
        ReviewAssigneeAnswers: {
          include: {
            ReviewAssigneeAnswerOption: true,
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

  if (req.method === "GET") {
    const data = await prisma.review.findUnique({
      where: {
        id: review_id,
      },
      include: {
        created: USER_SELECT_FEILDS,
        form: {
          include: {
            questions: {
              include: { options: true },
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
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "POST"],
    protectedRoute: true,
  });

export default functionHandle;

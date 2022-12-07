import { USER_SELECT_FEILDS } from "../../../../constants";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { review_id } = req.body;
  const { id: userId } = user;

  if (!review_id && !userId) {
    return res.status(401).json({ status: 401, message: "No Review found" });
  }

  const questionData = await prisma.review.findFirst({
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
  if (!questionData) {
    res.status(400).json({
      status: 400,
      message: "No Data Found",
    });
  }
  const answerData = await prisma.reviewAssigneeAnswers.findMany({
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
    data: {
      questionData: questionData,
      answerData: answerData,
    },
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

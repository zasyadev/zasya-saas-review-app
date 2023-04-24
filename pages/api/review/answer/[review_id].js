import { RequestHandler } from "../../../../lib/RequestHandler";
import { BadRequestException } from "../../../../lib/BadRequestExcpetion";

async function handle(req, res, prisma, user) {
  const { review_id } = req.query;
  const { id: userId } = user;

  if (!userId && !review_id) throw new BadRequestException("No User found.");

  const data = await prisma.reviewAssigneeAnswers.findFirst({
    where: {
      AND: [{ user_id: userId }, { review_assignee_id: review_id }],
    },
    include: {
      ReviewAssigneeAnswerOption: true,
    },
  });

  return res.status(200).json({
    data: data,
    message: "Review Details Retrieved",
  });
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: true,
  });

export default functionHandle;

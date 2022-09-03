import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (userId) {
    const reviewCreated = await prisma.review.findMany({
      where: { created_by: userId },
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
    });
    const reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
      where: { user_id: userId },
    });
    const userData = await prisma.user.findMany();

    let data = {
      reviewCreated: reviewCreated.length,
      reviewAnswered: reviewAnswered.length,
      userData: userData.length,
    };

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Dashboard Data Received",
      });
    }

    return res.status(404).json({ status: 404, message: "No Record Found" });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["GET"]);

import moment from "moment";
import { calculateMiliDuration } from "../../../helpers/momentHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

const currentYear = {
  lte: moment().endOf("year").format(),
  gte: moment().startOf("year").format(),
};

async function handle(_, res, prisma, user) {
  try {
    const { id: userId, organization_id } = user;

    if (!userId) throw BadRequestException("No user found");

    let pendingGoals = 0;
    let goalsProgress = 0;
    let averageAnswerTime = 0;

    const reviewCreated = await prisma.review.findMany({
      where: {
        AND: [
          {
            created_date: currentYear,
          },
          {
            organization_id: organization_id,
          },
          {
            created_by: userId,
          },
        ],
      },
    });
    const reviewRating = await prisma.review.findMany({
      where: {
        AND: [
          {
            created_by: userId,
          },
          {
            organization_id: organization_id,
          },
          {
            review_type: "feedback",
          },
        ],
      },
      include: {
        ReviewAssigneeAnswers: {
          include: {
            ReviewAssigneeAnswerOption: {
              include: {
                question: true,
              },
            },
          },
        },
      },
    });

    const reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
      where: {
        AND: [
          {
            created_date: currentYear,
          },
          {
            user_id: userId,
          },
          {
            review: {
              is: { organization_id: organization_id },
            },
          },
        ],
      },
    });

    const applaudData = await prisma.userApplaud.findMany({
      where: {
        AND: [
          { organization_id: organization_id },
          {
            created_by: userId,
          },
          {
            created_date: currentYear,
          },
        ],
      },
    });
    const goalsData = await prisma.goalAssignee.findMany({
      where: {
        AND: [
          { assignee_id: userId },
          {
            goal: {
              organization_id: organization_id,
              is_archived: false,
            },
          },
          {
            created_date: currentYear,
          },
        ],
      },
      include: {
        goal: true,
      },
    });

    if (reviewAnswered.length > 0) {
      const totalMili = reviewAnswered.reduce((prev, curr) => {
        let time = calculateMiliDuration({
          from: curr.created_assignee_date,
          to: curr.created_date,
        });

        return prev + time;
      }, 0);

      averageAnswerTime =
        totalMili > 0 ? Math.round(totalMili / reviewAnswered.length) : 0;
    }

    if (Number(goalsData.length) > 0) {
      let completedGoals = goalsData.filter(
        (item) => item?.status === "Completed"
      ).length;
      pendingGoals = goalsData.length - completedGoals;
      goalsProgress = Math.round(
        Number(completedGoals / goalsData?.length) * 100
      );
    }

    let data = {
      totalReviews:
        Number(reviewCreated.length) + Number(reviewAnswered.length),
      totalApplauds: Number(applaudData.length),
      totalGoals: Number(goalsData.length),
      reviewRating: reviewRating,
      averageAnswerTime: averageAnswerTime,
      pendingGoals,
      goalsProgress,
    };

    if (!data) throw BadRequestException("No record found");

    return res.status(200).json({
      data: data,
      message: "Dashboard Data Received",
    });
  } catch (error) {
    throw new BadRequestException("Internal server error.");
  }
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

import moment from "moment";
import { calculateMiliDuration } from "../../../helpers/momentHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";
import { getReviewRating } from "../../../helpers/ratingCalculationHelper";

const currentYear = {
  lte: moment().endOf("year").format(),
  gte: moment().startOf("year").format(),
};

async function handle(_, res, prisma, user) {
  try {
    const { id: userId, organization_id } = user;

    if (!userId) throw new BadRequestException("No user found");

    let pendingGoals = 0;
    let goalsProgress = 0;
    let averageAnswerTime = 0;

    const userReviews = await prisma.review.findMany({
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
    const userReviewsRating = await prisma.review.findMany({
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

    const userReviewsAnswered = await prisma.reviewAssigneeAnswers.findMany({
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

    const userApplaudData = await prisma.userApplaud.findMany({
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
    const userGoalData = await prisma.goalAssignee.findMany({
      where: {
        AND: [
          { assignee_id: userId },
          {
            goal: {
              organization_id: organization_id,
              is_archived: false,
            },
          },
          { created_date: currentYear },
        ],
      },
      include: {
        goal: true,
      },
    });

    if (userReviewsAnswered.length > 0) {
      const totalMili = userReviewsAnswered.reduce((prev, curr) => {
        let time = calculateMiliDuration({
          from: curr.created_assignee_date,
          to: curr.created_date,
        });

        return prev + time;
      }, 0);

      averageAnswerTime =
        totalMili > 0 ? Math.round(totalMili / userReviewsAnswered.length) : 0;
    }

    if (Number(userGoalData.length) > 0) {
      let completedGoals = userGoalData.filter(
        (item) => item?.status === "Completed"
      ).length;
      pendingGoals = userGoalData.length - completedGoals;
      goalsProgress = Math.round(
        Number(completedGoals / userGoalData?.length) * 100
      );
    }

    const reviewRating = getReviewRating(userReviewsRating);

    let data = {
      totalReviews:
        Number(userReviews.length) + Number(userReviewsAnswered.length),
      totalApplauds: Number(userApplaudData.length),
      totalGoals: Number(userGoalData.length),
      reviewRating: Number(reviewRating),
      averageAnswerTime: averageAnswerTime,
      pendingGoals,
      goalsProgress,
    };

    if (!data) throw new BadRequestException("No record found");

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

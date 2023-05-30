import { SCALE_TYPE } from "../component/Form/questioncomponents/constants";
import { REVIEW_RATING_QUESTION } from "../component/Review/constants";

export const getReviewRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const averageRatings = reviews.map((review) => {
    const reviewAssigneeAnswers = review.ReviewAssigneeAnswers || [];

    const ratings = reviewAssigneeAnswers
      .map((answer) => {
        const ratingQuestion = answer.ReviewAssigneeAnswerOption?.find(
          (option) =>
            option?.question?.questionText.toLowerCase() ===
              REVIEW_RATING_QUESTION.toLowerCase() &&
            option?.question?.type === SCALE_TYPE
        );
        return parseInt(ratingQuestion?.option) || 0;
      })
      .filter((rating) => !isNaN(rating));

    const totalRating = ratings.reduce((prev, curr) => prev + curr, 0);

    const averageRating = totalRating / ratings.length || 0;

    return averageRating;
  });
  const totalReviewsWithAnswers = averageRatings.length;

  const total = averageRatings.reduce((prev, curr) => prev + curr, 0);

  const averageRating = total / totalReviewsWithAnswers || 0;

  return Number(averageRating).toFixed(1);
};

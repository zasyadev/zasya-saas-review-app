import { calculateMiliDuration } from "../../../helpers/momentHelper";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const reqBody = req.body;

  try {
    if (reqBody.userId) {
      const userTableData = await prisma.user.findUnique({
        where: { id: reqBody.userId },
      });
      const reviewCreated = await prisma.review.findMany({
        where: {
          AND: [
            {
              created_by: reqBody.userId,
            },
            {
              organization_id: userTableData.organization_id,
            },
          ],
        },
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
      const reviewRating = await prisma.review.findMany({
        where: {
          AND: [
            {
              created_by: reqBody.userId,
            },
            {
              organization_id: userTableData.organization_id,
            },
            {
              review_type: "feedback",
            },
          ],
        },
        include: {
          ReviewAssigneeAnswers: {
            include: { ReviewAssigneeAnswerOption: true },
          },
        },
      });

      let reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
        where: {
          AND: [
            {
              user_id: reqBody.userId,
            },
            {
              review: {
                is: { organization_id: userTableData.organization_id },
              },
            },
          ],
        },
        include: {
          review_assignee: true,
        },
      });

      const userData = await prisma.userOraganizationGroups.findMany({
        where: {
          AND: [
            { organization_id: userTableData.organization_id },
            { status: true },
          ],
        },
      });

      const applaudData = await prisma.userApplaud.findMany({
        where: {
          AND: [
            { user_id: reqBody.userId },
            { organization_id: userTableData.organization_id },
          ],
        },
        include: {
          user: true,
        },
      });

      let filterApplaudData = [];
      if (applaudData.length > 0) {
        filterApplaudData = applaudData.filter((item) => {
          delete item?.user?.password;
          return true;
        });
      }

      let averageAnswerTime = 0;
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

      let data = {
        reviewCreatedCount: reviewCreated.length,
        reviewAnsweredCount: reviewAnswered.length,
        userCount: userData.length,
        applaudCount: filterApplaudData.length,
        reviewRating: reviewRating,
        averageAnswerTime: averageAnswerTime,
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
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
      errorMessage: error,
    });
  }
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);

export default functionHandle;

import moment from "moment";
import { RequestHandler } from "../../../lib/RequestHandler";

const currentMonth = {
  lte: moment().endOf("month").format(),
  gte: moment().startOf("month").format(),
};

async function handle(req, res, prisma) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      organization_id: true,
      UserDetails: true,
    },
  });

  if (userData) {
    const reviewData = await prisma.review.findMany({
      where: {
        AND: [
          {
            created_date: currentMonth,
          },
          {
            created_by: userId,
          },
          { organization_id: userData.organization_id },
        ],
      },
    });
    userData.reviewCount = reviewData?.length ?? 0;
  }

  return res.status(200).json({
    status: 200,
    data: userData,
    message: "All Data Retrieved",
  });
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);

export default functionHandle;

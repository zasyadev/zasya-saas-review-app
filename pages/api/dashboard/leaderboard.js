import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { date } = req.body;
  const { id: userId, organization_id } = user;

  if (!userId) throw BadRequestException("No user found");

  const orgData = await prisma.userOraganizationGroups.findMany({
    where: { organization_id: organization_id },
  });

  const whereCondition = {
    AND: [{ organization_id: organization_id }, { created_date: date }],
  };
  let userData = [];
  if (!orgData || !orgData.length) throw BadRequestException("No record found");

  await orgData.reduce(async (prev, user) => {
    await prev;
    let userDataObj = await prisma.user.findUnique({
      where: {
        id: user.user_id,
      },
      select: {
        first_name: true,
        id: true,
        status: true,
        Goals: {
          where: whereCondition,
        },
        userFeild: {
          where: whereCondition,
        },
        ReviewAssigneeAnswers: {
          where: whereCondition,
        },
        taskReviewBy: {
          where: whereCondition,
        },
        UserDetails: {
          select: {
            image: true,
          },
        },
      },
    });

    userData.push(await userDataObj);
  }, Promise.resolve());

  if (!userData || !userData.length)
    throw BadRequestException("No record found");

  return res.status(200).json({
    data: userData,
    message: "Monthly Leaderboard Data Received",
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

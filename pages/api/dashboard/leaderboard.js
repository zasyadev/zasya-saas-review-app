import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { date } = req.body;
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  const orgData = await prisma.userOraganizationGroups.findMany({
    where: { organization_id: organization_id },
  });

  const whereCondition = {
    AND: [{ organization_id: organization_id }, { created_date: date }],
  };
  let userData = [];
  if (Number(orgData.length) > 0) {
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

    if (Number(userData.length) > 0) {
      return res.status(200).json({
        status: 200,
        data: userData,
        message: "Monthly Leaderboard Data Received",
      });
    } else {
      return res.status(401).json({ status: 401, message: "No Record found" });
    }
  } else {
    return res.status(401).json({ status: 401, message: "No Record found" });
  }
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

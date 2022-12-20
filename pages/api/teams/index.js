import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    const data = await prisma.userTeams.findMany({
      orderBy: {
        modified_date: "desc",
      },
      where: {
        AND: [{ user_id: userId }, { organization_id: organization_id }],
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Teams Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    const reqBody = req.body;

    let transactionData = {};
    transactionData = await prisma.$transaction(async (transaction) => {
      const formdata = await transaction.userTeams.create({
        data: {
          created: { connect: { id: userId } },
          goal_title: reqBody.goal_title,
          goal_description: reqBody.goal_description,
          goal_type: reqBody.goal_type,
          status: reqBody.status,
          progress: reqBody.progress ?? 0,
          start_date: reqBody.start_date ?? new Date(),
          end_date: reqBody.end_date,
          organization: { connect: { id: organization_id } },
        },
      });

      return { formdata };
    });

    if (transactionData && transactionData.formdata) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Teams Details Saved Successfully ",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let transactionData = {};
    transactionData = await prisma.$transaction(async (transaction) => {
      await transaction.goalsTimeline.create({
        data: {
          user: { connect: { id: userId } },
          userTeams: { connect: { id: reqBody.id } },
          status: reqBody.status,
          comment: reqBody?.comment ?? "",
        },
      });

      const formdata = await transaction.userTeams.update({
        where: {
          id: reqBody.id,
        },
        data: {
          goal_title: reqBody.goal_title,
          goal_description: reqBody.goal_description,
          goal_type: reqBody.goal_type,

          end_date: reqBody.end_date,
        },
      });

      return { formdata };
    });

    if (transactionData && transactionData.formdata) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Teams Details Updated",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "POST", "PUT"],
    protectedRoute: true,
  });

export default functionHandle;

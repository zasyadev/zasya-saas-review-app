import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  const { goal_id } = req.query;
  if (!goal_id) {
    return res.status(401).json({ status: 401, message: "No Goal found" });
  }

  if (req.method === "GET") {
    const data = await prisma.goals.findUnique({
      where: { id: goal_id },
      include: {
        GoalsTimeline: {
          orderBy: {
            modified_date: "desc",
          },
          include: {
            user: {
              select: {
                first_name: true,
              },
            },
          },
        },
        GoalAssignee: {
          where: {
            NOT: {
              assignee_id: userId,
            },
          },
          include: {
            assignee: {
              select: {
                first_name: true,
                UserDetails: {
                  select: { image: true },
                },
              },
            },
          },
        },
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Goals Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    const data = await prisma.goals.findUnique({
      where: { id: goal_id },
      include: {
        GoalsTimeline: true,
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Goals Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let objData = {};

    if (reqBody.type === "forStatus") {
      objData = {
        status: reqBody.value.status,
      };

      await prisma.goalsTimeline.create({
        data: {
          ...objData,
          comment: reqBody.value.comment,
          user: { connect: { id: userId } },
          goals: { connect: { id: goal_id } },
        },
      });
    } else {
      objData = {
        is_archived: reqBody.value,
      };
    }

    const data = await prisma.goalAssignee.update({
      where: { id: reqBody.id },
      data: objData,
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Goals Details Updated",
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

import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  if (!userId) throw new BadRequestException("No User found");
  const { goal_id } = req.query;
  if (!goal_id) throw new BadRequestException("No Goal found");

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
        created: {
          select: {
            first_name: true,
          },
        },
        MeetingType: {
          select: {
            meeting: true,
          },
        },
      },
    });

    if (!data) throw new BadRequestException("No data found");

    return res.status(200).json({
      data: data,
      message: "Goals Details Retrieved",
    });
  } else if (req.method === "POST") {
    const data = await prisma.goals.findUnique({
      where: { id: goal_id },
      include: {
        GoalsTimeline: true,
      },
    });

    if (data) throw new BadRequestException("No data found");

    return res.status(200).json({
      data: data,
      message: "Goals Details Retrieved",
    });
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let objData = {};
    let data = {};

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

      data = await prisma.goalAssignee.update({
        where: { id: reqBody.id },
        data: objData,
      });
    } else if (reqBody.type === "forArchived") {
      objData = {
        is_archived: reqBody.value,
      };

      data = await prisma.goals.update({
        where: { id: goal_id },
        data: objData,
      });
    } else if (reqBody.type === "forDelete") {
      data = await prisma.goals.delete({
        where: { id: goal_id },
      });
    }

    if (!data) throw new BadRequestException("Goals details not updated");

    return res.status(200).json({
      data: data,
      message: "Goals Details Updated",
    });
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

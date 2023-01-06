import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  const { meeting_id } = req.query;
  if (!meeting_id) {
    return res.status(401).json({ status: 401, message: "No Meeting found" });
  }

  if (req.method === "GET") {
    const data = await prisma.meetings.findUnique({
      where: { id: meeting_id },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meetings Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    const data = await prisma.goals.findUnique({
      where: { id: meeting_id },
      include: {
        GoalsTimeline: true,
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meetings Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
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
          goals: { connect: { id: meeting_id } },
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
        where: { id: meeting_id },
        data: objData,
      });
    } else if (reqBody.type === "forDelete") {
      data = await prisma.goals.delete({
        where: { id: meeting_id },
      });
    }

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meetings Details Updated",
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

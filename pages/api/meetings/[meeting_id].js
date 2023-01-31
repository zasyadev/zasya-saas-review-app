import { deleteGoogleCalenderApi } from "../../../helpers/googleHelper";
import { RequestHandler } from "../../../lib/RequestHandler";
import { MEETING_ASSIGNEE_SCHEMA } from "../../../yup-schema/meeting";

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
      include: {
        review: {
          select: {
            ReviewAssignee: true,
            created_by: true,
            review_name: true,
            created_date: true,
          },
        },
        goal: {
          select: {
            GoalAssignee: true,
            goal_title: true,
            end_date: true,
          },
        },
        MeetingAssignee: {
          include: {
            assignee: {
              select: {
                first_name: true,
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
        message: "Meetings Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    try {
      const { comment, assigneeId } = req.body;
      const meetingAssigneeData = await prisma.meetingAssignee.findFirst({
        where: {
          AND: [{ meeting_id: meeting_id }, { assignee_id: assigneeId }],
        },
      });
      if (!meetingAssigneeData.id) {
        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
      const data = await prisma.meetingAssignee.update({
        where: {
          id: meetingAssigneeData.id,
        },
        data: {
          comment: comment,
        },
      });
      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Meetings Comment Updated",
        });
      }
      return res.status(404).json({ status: 404, message: "No Record Found" });
    } catch (error) {
      return res
        .status(404)
        .json({ status: 404, message: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    const eventData = await prisma.meetings.findUnique({
      where: { id: meeting_id },
    });
    if (eventData?.google_event_id) {
      await deleteGoogleCalenderApi({ eventId: eventData.google_event_id });
    }

    const data = await prisma.meetings.delete({
      where: { id: meeting_id },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Meetings Deleted",
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
    allowedMethods: ["GET", "DELETE", "POST"],
    protectedRoute: true,
    schemaObj: MEETING_ASSIGNEE_SCHEMA,
  });

export default functionHandle;

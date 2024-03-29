import { deleteGoogleCalenderApi } from "../../../helpers/googleHelper";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";
import { MEETING_ASSIGNEE_SCHEMA } from "../../../yup-schema/meeting";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  if (!userId) throw new BadRequestException("No user found");

  const { meeting_id } = req.query;
  if (!meeting_id) throw new BadRequestException("No meeting found");

  if (req.method === "GET") {
    const data = await prisma.meetings.findUnique({
      where: { id: meeting_id },
      include: {
        MeetingType: {
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
          },
        },
        MeetingAssignee: {
          include: {
            assignee: {
              select: {
                first_name: true,
                GoalAssignee: {
                  include: {
                    goal: true,
                  },
                },
              },
            },
            MeetingAssigneeComment: true,
          },
        },
      },
    });

    let goalData = [];
    let relatedMeetings = [];
    data.MeetingAssignee.filter(
      (item) => item.assignee_id !== data.created_by
    ).map((assignee) =>
      assignee.assignee.GoalAssignee.filter((goalAssignee) => {
        if (
          goalAssignee.goal.created_by === data.created_by &&
          goalAssignee.goal.is_archived === false
        ) {
          goalData.push(goalAssignee);
        }
      })
    );
    if (data.generated_by && data.generated_by === "System") {
      relatedMeetings = await prisma.meetings.findMany({
        orderBy: {
          meeting_at: "desc",
        },
        where: {
          meeting_title: data.meeting_title,
          generated_by: "System",
          organization_id: data.organization_id,
          NOT: {
            id: data.id,
          },
        },
        include: {
          MeetingAssignee: {
            include: {
              assignee: {
                select: {
                  first_name: true,
                },
              },
              MeetingAssigneeComment: true,
            },
          },
        },
      });
    }

    if (!data) throw new BadRequestException("No data found");

    return res.status(200).json({
      data: { ...data, goalData, relatedMeetings },
      message: "Meetings Details Retrieved",
    });
  } else if (req.method === "POST") {
    try {
      const { comment, assigneeId } = req.body;

      const meetingAssigneeData = await prisma.meetingAssignee.findFirst({
        where: {
          AND: [{ meeting_id: meeting_id }, { assignee_id: assigneeId }],
        },
      });
      if (!meetingAssigneeData.id)
        throw new BadRequestException("No record found");

      const data = await prisma.meetingAssigneeComment.create({
        data: {
          meeting_assignee: { connect: { id: meetingAssigneeData.id } },
          comment: comment,
        },
      });

      await prisma.meetings.update({
        where: { id: meeting_id },
        data: { is_completed: true },
      });

      if (!data) throw new BadRequestException("Meetings not updated");

      return res.status(200).json({
        data: data,
        message: "Meetings comment updated",
      });
    } catch (error) {
      throw new BadRequestException("Meetings not updated");
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

    if (!data) throw new BadRequestException("Meetings not deleted");

    return res.status(200).json({
      data: data,
      message: "Meetings deleted",
    });
  } else if (req.method === "PUT") {
    const { isCompleted } = req.body;

    const eventData = await prisma.meetings.update({
      where: { id: meeting_id },
      data: {
        is_completed: isCompleted,
      },
    });

    if (!eventData) throw new BadRequestException("Meetings not updated");

    return res.status(200).json({
      data: eventData,
      message: "Meetings updated",
    });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "DELETE", "POST", "PUT"],
    protectedRoute: true,
    schemaObj: MEETING_ASSIGNEE_SCHEMA,
  });

export default functionHandle;

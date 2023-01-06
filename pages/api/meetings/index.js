import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    const data = await prisma.meetings.findMany({
      orderBy: {
        modified_date: "desc",
      },
      where: {
        created_by: userId,
        organization_id: organization_id,
      },
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
    });
    let filterData = [];
    let filterList = [];
    if (Number(data?.length) > 0)
      filterList = data.map((item) => {
        if (item?.meeting_type === "Goal") {
          filterData = item?.goal?.GoalAssignee.map((i) => {
            return i.assignee_id;
          });
        }
        if (item?.meeting_type === "Review") {
          let list = [];
          list = item?.review?.ReviewAssignee.map((i) => {
            return i.assigned_to_id;
          });
          list.push(item?.review?.created_by);
          filterData = list;
        }

        return {
          ...item,
          assigneeList: filterData,
        };
      });

    if (filterList) {
      return res.status(200).json({
        status: 200,
        data: filterList,
        message: "Meetings Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    try {
      const reqBody = req.body;
      let data = {
        created: { connect: { id: userId } },
        meeting_title: reqBody.meeting_title,
        meeting_description: reqBody?.meeting_description ?? "",
        meeting_type: reqBody.meeting_type,
        frequency: reqBody?.frequency ?? "Once",
        meeting_at: reqBody.meeting_at,
        organization: { connect: { id: organization_id } },
      };

      if (reqBody.meeting_type === "Goal") {
        data.goal = { connect: { id: reqBody?.type_id } };
      } else if (reqBody.meeting_type === "Review") {
        data.review = { connect: { id: reqBody?.type_id } };
      }

      const createData = await prisma.meetings.create({
        data: data,
      });

      if (createData) {
        return res.status(200).json({
          status: 200,
          message: "Meeting Details Saved Successfully",
        });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ status: 404, message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let transactionData = {};

    if (transactionData) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Meeting Details Updated",
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

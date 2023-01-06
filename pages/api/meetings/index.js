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

      const create = await prisma.meetings.create({
        data: data,
      });

      if (create) {
        return res.status(200).json({
          status: 200,
          message: "Meeting Details Saved Successfully ",
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

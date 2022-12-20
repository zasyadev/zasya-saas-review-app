import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  const reqBody = req.body;

  const data = await prisma.goalsTimeline.create({
    user: { connect: { id: userId } },
    goals: { connect: { id: reqBody.id } },
    status: reqBody.status,
    comment: reqBody?.comment ?? "",
  });

  if (data) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Goals Updated",
    });
  }
  return res.status(404).json({ status: 404, message: "No Record Found" });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["PUT"],
    protectedRoute: true,
  });

export default functionHandle;

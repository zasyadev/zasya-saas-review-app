import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (!userId) throw BadRequestException("No User found");

  const data = await prisma.reviewTemplate.findMany({
    where: {
      AND: [{ user_id: userId }, { status: true }, { default_template: false }],
    },
  });

  if (!data) throw BadRequestException("No record found");

  return res.status(200).json({
    data: data,
    message: "Templates Retrieved",
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: true,
  });

export default functionHandle;

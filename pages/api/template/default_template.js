import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const data = await prisma.reviewTemplate.findMany({
    where: {
      AND: [{ status: true }, { default_template: true }],
    },
  });
  if (!data) throw new BadRequestException("No record found");

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

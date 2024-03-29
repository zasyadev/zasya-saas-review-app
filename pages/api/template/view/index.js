import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { template_id } = req.body;

  if (!template_id) throw new BadRequestException("Bad request");

  const data = await prisma.reviewTemplate.findUnique({
    where: {
      id: template_id,
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
    allowedMethods: ["POST"],
    protectedRoute: true,
  });

export default functionHandle;

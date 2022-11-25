import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const data = await prisma.reviewTemplate.findMany({
    where: {
      AND: [{ status: true }, { default_template: true }],
    },
  });

  if (data) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Templates Retrieved",
    });
  }

  return res.status(404).json({ status: 404, message: "No Record Found" });
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);
export default functionHandle;

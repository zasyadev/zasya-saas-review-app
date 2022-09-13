import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { template_id } = req.body;

  if (template_id) {
    const data = await prisma.reviewTemplate.findUnique({
      where: {
        id: template_id,
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
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

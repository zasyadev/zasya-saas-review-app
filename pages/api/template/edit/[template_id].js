import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { template_id } = req.query;
  const { userId } = req.body;

  if (userId && template_id) {
    const data = await prisma.reviewTemplate.findMany({
      where: {
        AND: [
          {
            id: template_id,
          },
          {
            user_id: userId,
          },
        ],
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data[0],
        message: "Templates Retrieved",
      });
    }

    return res.status(404).json({ status: 404, message: "No Record Found" });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["POST"]);

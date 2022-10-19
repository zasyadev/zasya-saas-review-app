import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (userId) {
    const data = await prisma.reviewTemplate.findMany({
      where: {
        AND: [
          { user_id: userId },
          { status: true },
          { default_template: false },
        ],
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
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);
export default functionHandle;

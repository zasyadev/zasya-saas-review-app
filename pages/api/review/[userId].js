import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (userId) {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    let data = await prisma.review.findMany({
      orderBy: {
        modified_date: "desc",
      },

      where: {
        AND: [
          {
            created_by: userId,
          },
          {
            organization_id: userData.organization_id,
            // is_published: "draft",
          },
        ],
      },
      include: {
        created: true,
        form: true,
        ReviewAssignee: {
          include: {
            assigned_to: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: 200,
      data: data,
      message: "All Data Retrieved",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["GET"]);

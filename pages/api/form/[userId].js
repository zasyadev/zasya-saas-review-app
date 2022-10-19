import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;
  try {
    if (userId) {
      const userData = await prisma.user.findUnique({
        where: { id: userId },
      });

      const data = await prisma.reviewAssignee.findMany({
        orderBy: {
          modified_date: "desc",
        },

        where: {
          AND: [
            {
              assigned_to_id: userId,
            },
            {
              review: {
                is: { organization_id: userData.organization_id },
              },
            },
          ],
        },
        include: {
          review: {
            include: {
              created: true,
              form: {
                include: {
                  questions: {
                    include: { options: true },
                  },
                },
              },
            },
          },
        },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Assign Details Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
}

const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);

export default functionHandle;

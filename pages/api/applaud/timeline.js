import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { date, userId } = req.body;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  const userTableData = await prisma.user.findUnique({
    where: { id: userId },
  });

  const allApplaudData = await prisma.userApplaud.findMany({
    orderBy: {
      created_date: "desc",
    },

    where: {
      AND: [
        { organization_id: userTableData.organization_id },
        {
          created_date: date,
        },
      ],
    },
    include: {
      user: {
        select: {
          first_name: true,
          UserDetails: {
            select: {
              image: true,
            },
          },
        },
      },
      created: {
        select: {
          first_name: true,
        },
      },
    },
  });

  return res.status(200).json({
    status: 200,
    data: allApplaudData,
    message: "Applaud Data Received",
  });
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["POST"]);

export default functionHandle;

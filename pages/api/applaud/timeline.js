import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { date } = req.body;
  const { id: userId, organization_id } = user;

  if (!userId) throw BadRequestException("No User found");

  const allApplaudData = await prisma.userApplaud.findMany({
    orderBy: {
      created_date: "desc",
    },
    where: {
      AND: [{ organization_id: organization_id }, { created_date: date }],
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

  if (!allApplaudData) throw BadRequestException("No Record found");

  return res.status(200).json({
    data: allApplaudData,
    message: "Applaud Data Received",
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

import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { userId } = req.query;
  const { organization_id } = user;

  if (!userId) throw BadRequestException("No user found");

  const { currentMonth } = req.body;
  const transactionData = await prisma.$transaction(async (transaction) => {
    const receivedApplaud = await transaction.userApplaud.findMany({
      where: {
        AND: [
          { user_id: userId },
          { created_date: currentMonth },
          { organization_id: organization_id },
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
            UserDetails: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    const givenApplaud = await transaction.userApplaud.findMany({
      orderBy: {
        created_date: "desc",
      },
      where: {
        AND: [
          { created_by: userId },
          { created_date: currentMonth },
          { organization_id: organization_id },
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
            UserDetails: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    return { receivedApplaud, givenApplaud };
  });

  if (!transactionData) throw BadRequestException("No Record Found");

  return res.status(200).json({
    data: transactionData,
    message: "Data Received",
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

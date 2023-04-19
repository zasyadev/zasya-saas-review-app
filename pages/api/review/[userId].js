import { USER_SELECT_FEILDS } from "../../../constants";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (!userId) throw new BadRequestException("No user found");

  const userData = await prisma.user.findUnique({
    where: { id: userId },
  });

  const data = await prisma.review.findMany({
    orderBy: {
      modified_date: "desc",
    },
    where: {
      AND: [
        { created_by: userId },
        { organization_id: userData.organization_id },
      ],
    },
    include: {
      created: USER_SELECT_FEILDS,
      form: true,
      ReviewAssignee: {
        include: {
          assigned_to: {
            select: {
              email: true,
              first_name: true,
              id: true,
              UserDetails: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!data) throw new BadRequestException("No record found");

  return res.status(200).json({
    data: data,
    message: "All Data Retrieved",
  });
}

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: true,
  });

export default functionHandle;

import { USER_SELECT_FEILDS } from "../../../constants";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

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
          created: USER_SELECT_FEILDS,
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

const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET"],
    protectedRoute: true,
  });

export default functionHandle;

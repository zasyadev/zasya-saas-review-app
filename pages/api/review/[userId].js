import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
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

  return res.status(200).json({
    status: 200,
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

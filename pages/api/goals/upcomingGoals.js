import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  let filteredStatement1 = [
    { assignee_id: userId },
    {
      goal: {
        organization_id: organization_id,
      },
    },
  ];
  let filteredStatement2 = [
    {
      goal: {
        goal_type: "Organization",
        organization_id: organization_id,
      },
    },
  ];

  if (req?.query?.status !== "All") {
    filteredStatement1.push({
      status: req.query.status,
    });
    filteredStatement2.push({
      status: req.query.status,
    });
  }

  if (req?.query?.isArchived) {
    let filter = {
      goal: {
        is_archived: true,
      },
    };
    filteredStatement1.push(filter);
    filteredStatement2.push(filter);
  } else {
    let filter = {
      goal: {
        is_archived: false,
      },
    };
    filteredStatement1.push(filter);
    filteredStatement2.push(filter);
  }

  const data = await prisma.goalAssignee.findMany({
    orderBy: {
      modified_date: "desc",
    },
    where: {
      OR: [{ AND: filteredStatement1 }, { AND: filteredStatement2 }],
    },
    include: {
      goal: {
        include: {
          created: {
            select: {
              first_name: true,
              id: true,
            },
          },
          GoalAssignee: {
            include: {
              assignee: {
                select: {
                  first_name: true,
                  UserDetails: {
                    select: { image: true },
                  },
                },
              },
            },
          },
        },
      },
      assignee: {
        select: {
          first_name: true,
          UserDetails: {
            select: { image: true },
          },
        },
      },
    },
  });

  if (data) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Goals Details Retrieved",
    });
  }
  return res.status(404).json({ status: 404, message: "No Record Found" });
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "POST", "PUT"],
    protectedRoute: true,
  });

export default functionHandle;

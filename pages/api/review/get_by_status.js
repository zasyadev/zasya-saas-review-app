import { USER_SELECT_FEILDS } from "../../../constants";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { status } = req.query;
  const { id: userId, organization_id } = user;

  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  try {
    const createdData = await prisma.review.findMany({
      where: {
        AND: [
          {
            created_by: userId,
          },
          {
            organization_id: organization_id,
          },
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

    const receviedData = await prisma.reviewAssignee.findMany({
      where: {
        AND: [
          {
            assigned_to_id: userId,
          },
          {
            review: {
              is: { organization_id: organization_id },
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

    let data = [];

    if (status === "All") {
      data = [...receviedData, ...createdData];
    } else if (status === "Created") {
      data = createdData;
    } else if (status === "Received") {
      data = receviedData;
    } else if (status === "Pending") {
      data = receviedData.filter((item) => !item.status);
    }
    data.sort((a, b) => b.modified_date - a.modified_date);

    const listCount = {
      all: receviedData.length + createdData.length,
      recevied: receviedData.length,
      created: createdData.length,
      pending: receviedData.filter((item) => !item.status).length,
    };

    return res.status(200).json({
      status: 200,
      data: {
        list: data,
        listCount: listCount,
      },
      message: "Data Retrieved",
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: 401, message: "Internal server error" });
  }
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

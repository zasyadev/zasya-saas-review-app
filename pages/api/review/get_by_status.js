import { REVIEW_FILTER_KEY } from "../../../component/Review/constants";
import { USER_SELECT_FEILDS } from "../../../constants";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { status } = req.query;
  const { id: userId, organization_id } = user;

  if (!userId) {
    throw new BadRequestException("No User found.");
  }
  try {
    const transactionData = await prisma.$transaction(async (transaction) => {
      const createdData = await transaction.review.findMany({
        where: {
          AND: [{ created_by: userId }, { organization_id: organization_id }],
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

      const receviedData = await transaction.reviewAssignee.findMany({
        where: {
          AND: [
            { assigned_to_id: userId },
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

      let list = [];
      if (status === REVIEW_FILTER_KEY.CREATED) {
        list = createdData;
      } else if (status === REVIEW_FILTER_KEY.RECEIVED) {
        list = receviedData;
      } else if (status === REVIEW_FILTER_KEY.PENDING) {
        list = receviedData.filter((item) => !item.status);
      } else {
        list = [...receviedData, ...createdData];
      }
      list.sort((a, b) => b.created_date - a.created_date);

      const listCount = {
        all: receviedData.length + createdData.length,
        recevied: receviedData.length,
        created: createdData.length,
        pending: receviedData.filter((item) => !item.status).length,
      };
      return { list, listCount };
    });

    return res.status(200).json({
      data: transactionData,
      message: "Data Retrieved",
    });
  } catch (error) {
    throw new BadRequestException("Internal server error.");
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

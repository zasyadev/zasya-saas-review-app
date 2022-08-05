import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMonthName = (month) => {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";

    default:
      return "";
  }
};

export default async (req, res) => {
  const reqBody = JSON.parse(req.body);

  if (req.method === "POST") {
    try {
      if (reqBody.userId) {
        const userTableData = await prisma.user.findUnique({
          where: { id: reqBody.userId },
        });
        const reviewCreated = await prisma.review.findMany({
          where: { created_by: reqBody.userId },
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
        });
        const reviewRating = await prisma.review.findMany({
          where: { created_by: reqBody.userId },
          include: {
            ReviewAssigneeAnswers: {
              include: { ReviewAssigneeAnswerOption: true },
            },
          },
        });

        let monthWiseData = [];
        if (reviewRating.length > 0) {
          monthWiseData = reviewRating?.reduce(function (obj, key) {
            let date = new Date(key.created_date);
            const objKey = getMonthName(date.getMonth());
            obj[objKey] = obj[objKey] || [];
            obj[objKey].push(key);
            return obj;
          }, {});
        }

        let reviewAnswered = await prisma.reviewAssigneeAnswers.findMany({
          where: {
            AND: [
              {
                user_id: reqBody.userId,
              },
              {
                review: {
                  is: { organization_id: userTableData.organization_id },
                },
              },
            ],
          },
        });

        const userData = await prisma.user.findMany({
          where: {
            AND: [
              { organization_id: userTableData.organization_id },
              { status: 1 },
            ],
          },
        });

        const applaudData = await prisma.userApplaud.findMany({
          where: { organization_id: userTableData.organization_id },
          include: {
            user: true,
          },
        });

        let filterApplaudData = [];
        if (applaudData.length > 0) {
          filterApplaudData = applaudData.filter((item) => {
            delete item?.user?.password;
            return true;
          });
        }

        let data = {
          reviewCreated: reviewCreated.length,
          reviewAnswered: reviewAnswered.length,
          userData: userData.length,
          applaudData: filterApplaudData,
          reviewRating: reviewRating,
        };

        if (data) {
          return res.status(200).json({
            status: 200,
            data: data,
            message: "Dashboard Data Received",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: "Internal Server Error",
        errorMessage: error,
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

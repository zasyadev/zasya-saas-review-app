import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (userId) {
        const userTableData = await prisma.user.findUnique({
          where: { id: userId },
        });

        const orgData = await prisma.userOraganizationGroups.findMany({
          where: { organization_id: userTableData.organization_id },

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
          },
        });

        const reviewAssignedData = await prisma.review.findMany({
          where: { organization_id: userTableData.organization_id },
          include: {
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

        const reviewAnsweredData = await prisma.reviewAssigneeAnswers.findMany({
          where: { organization_id: userTableData.organization_id },
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
          },
        });

        let fetchData = {};
        if (orgData.length > 0 && reviewAnsweredData.length > 0) {
          let takefilterData = reviewAnsweredData.filter(({ user_id: id1 }) =>
            orgData.some(({ user_id: id2 }) => id2 === id1)
          );
          let takeleftOverData = orgData.filter(
            ({ user_id: id1 }) =>
              !reviewAnsweredData.some(({ user_id: id2 }) => id2 === id1)
          );

          let takeresults = takefilterData?.reduce(function (obj, key) {
            obj[key.user.first_name] = obj[key.user.first_name] || {};

            if (!obj[key.user.first_name]?.taken) {
              obj[key.user.first_name].taken = [];
            }
            obj[key.user.first_name].taken.push(key);
            if (key.user.UserDetails && key.user.UserDetails.image) {
              obj[key.user.first_name].userImg = key.user.UserDetails.image;
            } else {
              obj[key.user.first_name].userImg = "";
            }
            return obj;
          }, {});

          let takeleftOutResults = takeleftOverData?.reduce(function (
            obj,
            key
          ) {
            obj[key.user.first_name] = obj[key.user.first_name] || {};
            if (!obj[key.user.first_name]?.taken) {
              obj[key.user.first_name].taken = [];
            }
            if (key.user.UserDetails && key.user.UserDetails.image) {
              obj[key.user.first_name].userImg = key.user.UserDetails.image;
            } else {
              obj[key.user.first_name].userImg = "";
            }
            return obj;
          },
          {});

          let takeObj = { ...takeresults, ...takeleftOutResults };

          let givenFilterData = reviewAssignedData.filter(
            ({ created_by: id1 }) =>
              orgData.some(({ user_id: id2 }) => id2 === id1)
          );
          let givenleftOutMember = orgData.filter(
            ({ user_id: id1 }) =>
              !reviewAssignedData.some(({ created_by: id2 }) => id2 === id1)
          );

          let givenResults = givenFilterData?.reduce(function (obj, key) {
            obj[key.created.first_name] = obj[key.created.first_name] || {};

            if (!obj[key.created.first_name]?.feedbackAssigned) {
              obj[key.created.first_name].feedbackAssigned = [];
            }
            obj[key.created.first_name].feedbackAssigned.push(key);

            return obj;
          }, {});

          let givenLeftOutResults = givenleftOutMember?.reduce(function (
            obj,
            key
          ) {
            obj[key.user.first_name] = obj[key.user.first_name] || {};
            if (!obj[key.user.first_name]?.feedbackAssigned) {
              obj[key.user.first_name].feedbackAssigned = [];
            }

            return obj;
          },
          {});

          let givenObj = { ...givenResults, ...givenLeftOutResults };

          let conbinedData = Object.entries(takeObj).map(([key, value]) => {
            let feedbackTakenObj = {
              feedbackTaken: takeObj[key]?.taken?.length,
              image: value.userImg ?? "",
            };
            let feedbackGivenObj = {
              feedbackGiven: givenObj[key]?.feedbackAssigned?.length,
            };

            return {
              [key]: {
                ...feedbackTakenObj,
                ...feedbackGivenObj,
              },
            };
          });

          if (conbinedData.length > 0) {
            let data = conbinedData?.sort(
              (a, b) =>
                b[Object.keys(b)]?.feedbackGiven -
                a[Object.keys(a)]?.feedbackGiven
            );

            fetchData = conbinedData;
          }
        }

        prisma.$disconnect();
        if (Object.keys(fetchData).length) {
          return res.status(200).json({
            status: 200,
            data: fetchData,
            message: "Feeback Data Received",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

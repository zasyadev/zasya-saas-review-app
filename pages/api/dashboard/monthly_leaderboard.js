import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { date, userId } = req.body;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  const userTableData = await prisma.user.findUnique({
    where: { id: userId },
  });

  const orgData = await prisma.userOraganizationGroups.findMany({
    where: { organization_id: userTableData.organization_id },

    include: {
      user: {
        select: {
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
  });

  const applaudData = await prisma.userApplaud.findMany({
    orderBy: {
      created_date: "desc",
    },

    where: {
      AND: [
        { organization_id: userTableData.organization_id },
        {
          created_date: date,
        },
      ],
    },
    include: {
      user: {
        select: {
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
  });

  let topApplaudData = {};
  if (orgData.length > 0) {
    let takefilterData = [];

    if (applaudData && applaudData.length) {
      takefilterData = applaudData.filter(({ user_id: id1 }) =>
        orgData.some(({ user_id: id2 }) => id2 === id1)
      );
    }

    let takeresults = takefilterData?.reduce(function (obj, key) {
      obj[key.user.first_name] = obj[key.user.first_name] || {};

      if (!obj[key.user.first_name]?.taken) {
        obj[key.user.first_name].taken = [];
      }
      obj[key.user.first_name].taken.push(key);
      obj[key.user.first_name].user_id = key.user.id;
      if (key.user.UserDetails && key.user.UserDetails.image) {
        obj[key.user.first_name].userImg = key.user.UserDetails.image;
      } else {
        obj[key.user.first_name].userImg = "";
      }

      return obj;
    }, {});

    let conbinedData = Object.entries(takeresults)
      .map(([key, value]) => {
        if (takeresults[key]?.taken.length > 0) {
          let applaudTakenObj = {
            count: takeresults[key]?.taken.length,
            image: value.userImg ?? "",
            user_id: value.user_id,
          };
          return {
            [key]: {
              ...applaudTakenObj,
            },
          };
        } else {
          return null;
        }
      })
      .sort((a, b) => b[Object.keys(b)]?.count - a[Object.keys(a)]?.count)
      .slice(0, 2);

    if (conbinedData.length > 0) topApplaudData = conbinedData;
  }

  return res.status(200).json({
    status: 200,
    data: {
      applaudData: topApplaudData,
    },
    message: "Monthly Leaderboard Data Received",
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

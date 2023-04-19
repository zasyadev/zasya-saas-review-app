import { BadRequestException } from "../../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { date } = req.body;
  const { id: userId, organization_id } = user;

  if (!userId) throw new BadRequestException("No User found");

  const orgData = await prisma.userOraganizationGroups.findMany({
    where: { organization_id: organization_id },

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
        { organization_id: organization_id },
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
      created: {
        select: {
          first_name: true,
          id: true,
        },
      },
    },
  });

  if (!applaudData) throw new BadRequestException("No applaud found");

  let fetchData = {};
  if (orgData.length > 0) {
    let takefilterData = [];

    let givenFilterData = [];

    if (applaudData && applaudData.length) {
      takefilterData = applaudData.filter(({ user_id: id1 }) =>
        orgData.some(({ user_id: id2 }) => id2 === id1)
      );

      givenFilterData = applaudData.filter(({ created_by: id1 }) =>
        orgData.some(({ user_id: id2 }) => id2 === id1)
      );
    }

    let takeleftOverData = orgData.filter(
      ({ user_id: id1 }) => !applaudData.some(({ user_id: id2 }) => id2 === id1)
    );
    let givenleftOutMember = orgData.filter(
      ({ user_id: id1 }) =>
        !applaudData.some(({ created_by: id2 }) => id2 === id1)
    );

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

    let takeleftOutResults = takeleftOverData?.reduce(function (obj, key) {
      obj[key.user.first_name] = obj[key.user.first_name] || {};
      if (!obj[key.user.first_name]?.taken) {
        obj[key.user.first_name].taken = [];
      }
      obj[key.user.first_name].user_id = key.user.id;
      if (key.user.UserDetails && key.user.UserDetails.image) {
        obj[key.user.first_name].userImg = key.user.UserDetails.image;
      } else {
        obj[key.user.first_name].userImg = "";
      }

      return obj;
    }, {});

    let takeObj = { ...takeresults, ...takeleftOutResults };

    let givenResults = givenFilterData?.reduce(function (obj, key) {
      obj[key.created.first_name] = obj[key.created.first_name] || {};

      if (!obj[key.created.first_name]?.given) {
        obj[key.created.first_name].given = [];
      }
      obj[key.created.first_name].given.push(key);

      return obj;
    }, {});

    let givenLeftOutResults = givenleftOutMember?.reduce(function (obj, key) {
      obj[key.user.first_name] = obj[key.user.first_name] || {};
      if (!obj[key.user.first_name]?.given) {
        obj[key.user.first_name].given = [];
      }

      return obj;
    }, {});

    let givenObj = { ...givenResults, ...givenLeftOutResults };

    let conbinedData = Object.entries(takeObj).map(([key, value]) => {
      let applaudTakenObj = {
        taken: takeObj[key]?.taken,
        image: value.userImg ?? "",
        user_id: value.user_id,
      };
      let applaudGivenObj = {
        given: givenObj[key]?.given,
      };

      return {
        [key]: {
          ...applaudTakenObj,
          ...applaudGivenObj,
        },
      };
    });

    if (conbinedData.length > 0) fetchData = conbinedData;
  }

  return res.status(200).json({
    data: fetchData,
    message: "Applaud Data Received",
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

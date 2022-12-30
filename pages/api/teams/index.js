import { USER_SELECT_FEILDS } from "../../../constants";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  if (req.method === "GET") {
    const data = await prisma.userTeams.findMany({
      orderBy: {
        modified_date: "desc",
      },
      where: {
        AND: [{ user_id: userId }, { organization_id: organization_id }],
      },
      include: {
        UserTeamsGroups: {
          include: {
            member: USER_SELECT_FEILDS,
          },
        },
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "Teams Details Retrieved",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "POST") {
    const reqBody = req.body;

    let transactionData = {};
    transactionData = await prisma.$transaction(async (transaction) => {
      let teamGroups = [];

      teamGroups = reqBody.members.map((member) => {
        return {
          member: { connect: { id: member } },
          role: { connect: { id: 4 } },
          isManager: false,
        };
      });

      let managerData = {
        member: { connect: { id: reqBody.manager } },
        role: { connect: { id: 3 } },
        isManager: true,
      };
      teamGroups.push(managerData);

      const formdata = await transaction.userTeams.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          organization: {
            connect: {
              id: organization_id,
            },
          },
          team_name: reqBody.name,
          UserTeamsGroups: {
            create: teamGroups,
          },
        },
      });

      return { formdata };
    });

    if (transactionData && transactionData.formdata) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Team Created  Successfully ",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let transactionData = {};
    if (reqBody.id) {
      transactionData = await prisma.$transaction(async (transaction) => {
        await transaction.userTeams.delete({
          where: {
            id: reqBody.id,
          },
        });

        let teamGroups = [];
        teamGroups = reqBody.members.map((member) => {
          return {
            member: { connect: { id: member } },
            role: { connect: { id: 4 } },
            isManager: false,
          };
        });

        let managerData = {
          member: { connect: { id: reqBody.manager } },
          role: { connect: { id: 3 } },
          isManager: true,
        };
        teamGroups.push(managerData);

        const formdata = await transaction.userTeams.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            organization: {
              connect: {
                id: organization_id,
              },
            },
            team_name: reqBody.name,
            UserTeamsGroups: {
              create: teamGroups,
            },
          },
        });

        return { formdata };
      });
    } else {
      return res.status(404).json({ status: 404, message: "No Record Found" });
    }

    if (transactionData && transactionData.formdata) {
      return res.status(200).json({
        status: 200,
        data: transactionData.formdata,
        message: "Teams Details Updated",
      });
    }
  }
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

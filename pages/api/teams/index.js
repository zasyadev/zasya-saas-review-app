import { USER_SELECT_FEILDS } from "../../../constants";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId, organization_id } = user;

  if (!userId) throw new BadRequestException("No user found");

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
    if (!data) throw new BadRequestException("No record found");
    return res.status(200).json({
      data: data,
      message: "Teams Details Retrieved",
    });
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
    if (!transactionData || !transactionData.formdata)
      throw new BadRequestException("No record found");

    return res.status(200).json({
      data: transactionData.formdata,
      message: "Team Created  Successfully ",
    });
  } else if (req.method === "PUT") {
    const reqBody = req.body;

    let transactionData = {};
    if (!reqBody.id) throw new BadRequestException("No record found");

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

    if (!transactionData || !transactionData.formdata)
      throw new BadRequestException("No record found");

    return res.status(200).json({
      data: transactionData.formdata,
      message: "Teams Details Updated",
    });
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

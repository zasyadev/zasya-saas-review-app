import { USER_SELECT_FEILDS } from "../../../constants";
import { BadRequestException } from "../../../lib/BadRequestExcpetion";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  const { team_id } = req.query;
  const teamId = Number(team_id);
  if (!userId) throw new BadRequestException("No user found");

  if (!teamId) throw new BadRequestException("No team found");

  if (req.method === "GET") {
    const data = await prisma.userTeams.findUnique({
      where: { id: teamId },
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
  } else if (req.method === "DELETE") {
    const data = await prisma.userTeams.delete({
      where: {
        id: teamId,
      },
    });

    if (!data) throw new BadRequestException("No record found");
    return res.status(200).json({
      message: "Team Deleted Successfully",
    });
  }
}
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["GET", "DELETE"],
    protectedRoute: true,
  });

export default functionHandle;

import { USER_SELECT_FEILDS } from "../../../constants";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;
  const { team_id } = req.query;
  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }
  if (req.method === "GET") {
    const data = await prisma.userTeams.findUnique({
      where: { id: Number(team_id) },
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
  } else if (req.method === "DELETE") {
    const data = await prisma.userTeams.delete({
      where: {
        id: Number(team_id),
      },
    });

    if (data) {
      return res.status(200).json({
        status: 200,

        message: "Team Deleted Successfully",
      });
    }
    return res.status(404).json({ status: 404, message: "No Record Found" });
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

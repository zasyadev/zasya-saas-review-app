import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  const { user_id } = req.query;
  const data = await prisma.user.findUnique({
    where: { id: user_id },
    include: {
      organization: true,
      UserDetails: {
        select: {
          image: true,
        },
      },
    },
  });

  const roleData = await prisma.userOraganizationGroups.findFirst({
    where: {
      AND: [{ user_id: user_id }, { organization_id: data.organization_id }],
    },
  });

  if (data) delete data.password;

  const filterdata = {
    ...data,
    roleData: roleData,
  };

  return res.status(200).json({
    status: 200,
    data: filterdata,
    message: "All Data Retrieved",
  });
}
const functionHandle = (req, res) => RequestHandler(req, res, handle, ["GET"]);

export default functionHandle;

import { RequestHandler } from "../../../../lib/RequestHandler";

async function handle(req, res, prisma, user) {
  const { id: userId } = user;

  if (!userId) {
    return res.status(401).json({ status: 401, message: "No User found" });
  }

  const userOrgData = await prisma.user.findUnique({
    where: { id: userId },
  });

  const data = await prisma.userOraganizationGroups.findMany({
    where: { organization_id: userOrgData.organization_id },
    include: {
      user: true,
    },
  });

  const filterdata = data
    // .filter((item) => item.status === 1)
    .map((item) => {
      delete item.password;
      return item;
    });

  if (filterdata) {
    return res.status(200).json({
      status: 200,
      data: filterdata,
      message: "All Data Retrieved",
    });
  }

  return res.status(404).json({ status: 404, message: "No Record Found" });
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

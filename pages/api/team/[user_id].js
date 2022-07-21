import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { user_id } = req.query;
  try {
    if (req.method === "GET") {
      if (user_id) {
        const userData = await prisma.user.findUnique({
          where: { id: user_id },
        });
        const data = await prisma.userOraganizationGroups.findMany({
          where: { organization_id: userData.organization_id },

          include: {
            user: {
              include: {
                UserTags: true,
              },
            },
          },
        });

        const filterdata = data
          .filter(
            (item) =>
              // (item.user.role_id === 4 || item.user.role_id === 3) &&
              item.status === true
          )
          .map((item) => {
            delete item?.user?.password;
            return item;
          });
        prisma.$disconnect();
        if (filterdata) {
          return res.status(200).json({
            status: 200,
            data: filterdata,
            message: "All Data Retrieved",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } else {
      return res.status(405).json({
        message: "Method Not allowed",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
};

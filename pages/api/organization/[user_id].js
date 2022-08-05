import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { user_id } = req.query;
  try {
    if (req.method === "GET") {
      if (user_id) {
        const data = await prisma.user.findMany({
          where: { id: user_id },
          include: {
            // UserTags: true,
            organization: true,
            UserDetails: {
              select: {
                image: true,
              },
            },
          },
        });

        let roleData = {};
        if (data.length > 0) {
          roleData = await prisma.userOraganizationGroups.findFirst({
            where: {
              AND: [
                { user_id: user_id },
                { organization_id: data[0].organization_id },
              ],
            },
          });
        }

        const filterdata = data
          // .filter((item) => item.status === 1)
          .map((item) => {
            delete item.password;
            return {
              ...item,
              roleData: roleData,
            };
          });
        prisma.$disconnect();
        if (filterdata) {
          return res.status(200).json({
            status: 200,
            data: filterdata[0],
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
    console.log(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
};

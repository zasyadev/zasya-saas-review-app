import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { organization_id } = req.query;
  try {
    if (req.method === "GET") {
      if (organization_id) {
        const data = await prisma.user.findMany({
          where: { organization_id: Number(organization_id) },

          include: {
            TagsEmployees: true,
          },
        });
        const filterdata = data
          .filter((item) => item.role_id === 4)
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

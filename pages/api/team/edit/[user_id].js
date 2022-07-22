import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { user_id } = req.query;
  const resBody = JSON.parse(req.body);
  try {
    if (req.method === "POST") {
      if (user_id && resBody.org_user) {
        const data = await prisma.user.findUnique({
          where: { id: user_id },
          include: {
            UserOraganizationGroups: true,
          },
        });
        const orgData = await prisma.user.findUnique({
          where: { id: resBody.org_user },
        });

        prisma.$disconnect();
        if (data) {
          let userOrgData = {};

          if (data?.UserOraganizationGroups.length > 0) {
            data?.UserOraganizationGroups.forEach((item) => {
              if (item.organization_id == orgData.organization_id)
                userOrgData = item;
            });
          }
          data["userOrgData"] = userOrgData;
          delete data.password;
          delete data?.UserOraganizationGroups;
          return res.status(200).json({
            status: 200,
            data: data,
            message: "User Details Retrieved",
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
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

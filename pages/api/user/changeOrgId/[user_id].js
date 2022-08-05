import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { user_id } = req.query;
  const reqBody = JSON.parse(req.body);
  try {
    if (req.method === "POST") {
      if (user_id && reqBody.org_id) {
        // let roleData = await prisma.userOraganizationGroups.findFirst({
        //   where: {
        //     AND: [{ user_id: user_id }, { organization_id: reqBody.org_id }],
        //   },
        // });

        let userData = await prisma.user.update({
          where: { id: user_id },
          data: {
            organization_id: reqBody.org_id,
          },
        });

        prisma.$disconnect();
        if (userData) {
          return res.status(200).json({
            status: 200,
            data: userData,
            message: "Organization Updated",
          });
        }
        return res.status(400).json({
          status: 400,

          message: "Organization Not Updated",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
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

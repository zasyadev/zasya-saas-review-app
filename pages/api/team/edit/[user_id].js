import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  const { user_id } = req.query;

  try {
    if (req.method === "GET") {
      if (user_id) {
        const data = await prisma.user.findUnique({
          where: { id: user_id },
          include: {
            UserTags: true,
          },
        });

        prisma.$disconnect();
        if (data) {
          delete data.password;
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

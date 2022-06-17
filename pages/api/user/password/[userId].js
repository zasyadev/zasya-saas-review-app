import { PrismaClient } from "@prisma/client";
import { hashedPassword, compareHashedPassword } from "../../../../lib/auth";

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    const { userId } = req.query;

    const reqData = JSON.parse(req.body);
    if (req.method === "POST") {
      if (userId) {
        const data = await prisma.user.findUnique({
          where: { id: userId },
        });
        const compare = await compareHashedPassword(
          reqData.old_password,
          data.password
        );
        if (compare) {
          const updateData = await prisma.user.update({
            where: { email: data.email },
            data: {
              password: await hashedPassword(reqData.new_password),
            },
          });
          if (updateData) {
            return res.status(200).json({
              status: 200,
              data: updateData,
              message: "Password Updated",
            });
          } else {
            return res
              .status(404)
              .json({ status: 404, message: "No Record Found" });
          }
        } else {
          return res
            .status(400)
            .json({ status: 400, message: "Wrong Old Password" });
        }
      }
    } else {
      return res.status(405).json({
        message: "Method Not allowed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

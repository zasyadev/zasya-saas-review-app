import { PrismaClient } from "@prisma/client";
import { hashedPassword } from "../../../../lib/auth";

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      const reqBody = JSON.parse(req.body);

      const data = await prisma.passwordReset.findUnique({
        where: { email_id: reqBody.email },
      });

      if (!data) {
        return res
          .status(400)
          .json({ status: 400, message: "Wrong Email Address " });
      }

      if (reqBody.token === data.token) {
        const updateData = await prisma.user.update({
          where: { email: reqBody.email },
          data: {
            password: await hashedPassword(reqBody.password),
            status: 1,
          },
        });

        if (updateData) {
          const deleteData = await prisma.passwordReset.delete({
            where: { email_id: reqBody.email },
          });
          return res.status(200).json({
            status: 200,
            data: updateData,
            message: "Password has been Updated",
          });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: "No Record Found" });
        }
      } else {
        return res.status(400).json({ status: 400, message: "Wrong Token " });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: "Internal Server Error",
    });
  }
};

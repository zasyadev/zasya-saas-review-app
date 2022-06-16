import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    return res.status(200).json({ status: 404, message: "Upload" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const reqBody = JSON.parse(req.body);

      let userData = await prisma.user.findUnique({
        where: { id: reqBody.user_id },
      });

      if (userData) {
        const data = await prisma.userApplaud.create({
          data: {
            user: { connect: { id: reqBody.user_id } },
            comment: reqBody.comment,
            created: { connect: { id: reqBody.created_by } },
            organization: { connect: { id: userData.organization_id } },
          },
        });

        prisma.$disconnect();

        return res.status(201).json({
          message: "Saved  Successfully",
          data: data,
          status: 200,
        });
      } else {
        return res
          .status(402)
          .json({ error: "error", message: "User Not Found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.userApplaud.findMany({
        include: { user: true, created: true },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Applaud Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const reqBody = JSON.parse(req.body);

      const data = await prisma.userApplaud.update({
        where: { id: reqBody.id },
        data: {
          user_id: reqBody.user_id,
          comment: reqBody.comment,
          created_by: reqBody.created_by,
        },
      });
      prisma.$disconnect();
      if (data) {
        return res.status(201).json({
          message: "Saved  Successfully",
          data: data,
          status: 200,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const deletaData = await prisma.userApplaud.delete({
        where: { id: reqBody.id },
      });

      prisma.$disconnect();
      if (deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Form Deleted Successfully.",
        });
      }
      return res.status(400).json({
        status: 400,
        message: "Failed To Delete Record.",
      });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

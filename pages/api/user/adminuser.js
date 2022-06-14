import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      let userobj = {
        name: resData.name,
        category: resData.category,
        status: resData.status,
        user: { connect: { id: resData.user_id } },
      };

      const savedData = await prisma.user.create({
        data: userobj,
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "User Saved Successfully",
        data: savedData,
        status: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      let userData = await prisma.user.findMany({ include: { role: true } });

      userData = userData.filter((item) => {
        if (item.role_id) {
          delete item.password;
          return true;
        } else return false;
      });

      if (userData) {
        return res.status(200).json({
          status: 200,
          data: userData,
          message: "All Users Retrieved",
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
      const resData = JSON.parse(req.body);

      const data = await prisma.user.update({
        where: { id: resData.id },
        data: {
          email: resData.email,
          first_name: resData.first_name,
          last_name: resData.last_name,
          address: "",
          pin_code: "",
          mobile: "",
          status: resData.status,
          role: { connect: { id: resData.role } },
        },
      });

      prisma.$disconnect();

      return res.status(200).json({
        message: "User Updated Successfully.",
        status: 200,
        data: data,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const resData = await prisma.user.update({
        where: { id: reqBody.id },
        data: {
          email: reqBody.email,
          password: reqBody.password,
          first_name: reqBody.first_name,

          last_name: reqBody.last_name,
          address: "",
          pin_code: "",
          mobile: "",
          status: 0,
          role: { connect: { id: reqBody.role_id } },
        },
      });

      prisma.$disconnect();
      if (resData) {
        return res.status(200).json({
          status: 200,
          message: "User Deleted Successfully.",
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

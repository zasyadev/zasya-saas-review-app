import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      let dataObj = {
        user: { connect: { id: resData.user_id } },
        form_data: resData.form_data,
        status: resData.status,
      };

      const savedData = await prisma.formTable.create({
        data: dataObj,
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "Form Saved Successfully",
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
      const data = await prisma.formTable.findMany();

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Forms Retrieved",
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

      const data = await prisma.formTable.update({
        where: { id: resData.id },
        data: {
          user: { connect: { id: resData.user_id } },
          form_data: resData.form_data,
          status: resData.status,
        },
      });
      prisma.$disconnect();

      return res.status(200).json({
        message: "Form Updated Successfully.",
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
      const deletaData = await prisma.formTable.delete({
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

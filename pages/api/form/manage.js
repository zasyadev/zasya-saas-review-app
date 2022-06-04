import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      let dataObj = {
        assigned_by: { connect: { id: resData.assigned_by_id } },
        assigned_to: { connect: { id: resData.assigned_to_id } },
        form: { connect: { id: resData.form_id } },
        status: resData.status,
      };
      //
      const savedData = await prisma.formAssign.create({
        data: dataObj,
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "Assigned Successfully",
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
      const data = await prisma.formAssign.findMany({
        include: { assigned_by: true, assigned_to: true, form: true },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Data Retrieved",
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
      return;

      const data = await prisma.formAssign.update({
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
      const deletaData = await prisma.formAssign.delete({
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

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);
      const templateData = await prisma.templateTable.findUnique({
        where: { id: resData.template_id },
      });

      const transactionData = await prisma.$transaction(async (transaction) => {
        const questionData = templateData.form_data.questions.map((item) => {
          const optionData = item.options.map((opitem) => {
            return {
              optionText: opitem.optionText,
            };
          });

          return {
            questionText: item.questionText,
            type: item.type,
            open: item.open,
            options: { create: optionData },
          };
        });

        const formdata = await transaction.formTable.create({
          data: {
            user: { connect: { id: resData.assigned_by_id } },
            form_title: templateData.form_title,
            form_description: templateData.form_description,
            form_data: templateData.form_data,
            status: templateData.status,
            questions: {
              create: questionData,
            },
          },
        });

        return { formdata };
      });

      let dataObj = {
        assigned_by: { connect: { id: resData.assigned_by_id } },
        assigned_to: { connect: { id: resData.assigned_to_id } },
        form: { connect: { id: transactionData.formdata.id } },
        status: resData.status ?? "pending",
        frequency: resData.frequency,
        review_type: resData.review_type,
      };

      const savedData = await prisma.reviewAssign.create({
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
      const data = await prisma.reviewAssign.findMany({
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

      const data = await prisma.reviewAssign.update({
        where: { id: resData.id },
        data: {
          assigned_by_id: resData.assigned_by_id,
          assigned_to_id: resData.assigned_to_id,
          template_id: resData.template_id,
          status: resData.status ?? "pending",
          frequency: resData.frequency,
          review_type: resData.review_type,
        },
      });
      prisma.$disconnect();

      return res.status(200).json({
        message: "Assign Updated Successfully.",
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
      const deletaData = await prisma.reviewAssign.delete({
        where: { id: reqBody.id },
      });
      prisma.$disconnect();
      if (deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Form Assign Deleted Successfully.",
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

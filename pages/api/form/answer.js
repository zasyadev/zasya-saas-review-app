import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);
      const transactionData = await prisma.$transaction(async (transaction) => {
        const answerData = resData.answers.map((item) => {
          return {
            question: { connect: { id: item.questionId } },
            option: item.answer,
          };
        });

        const formdata = await transaction.templateAnswers.create({
          data: {
            user: { connect: { id: resData.user_id } },
            template: { connect: { id: resData.template_id } },
            QuestionAnswers: {
              create: answerData,
            },
          },
        });
        return { formdata };
      });

      if (!transactionData.formdata || !transactionData) {
        prisma.$disconnect();
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error!",
          data: {},
        });
      }
      prisma.$disconnect();
      return res.status(201).json({
        message: "Review Saved Sucessfully.",
        data: transactionData.formdata,
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

      const data = await prisma.formAssign.update({
        where: { id: resData.id },
        data: {
          assigned_by_id: resData.assigned_by_id,
          assigned_to_id: resData.assigned_to_id,
          form_id: resData.form_id,
          status: resData.status,
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
      const deletaData = await prisma.formAssign.delete({
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

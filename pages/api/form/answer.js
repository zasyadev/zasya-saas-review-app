import { PrismaClient } from "@prisma/client";
import { mailService, mailTemplate } from "../../../lib/emailservice";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      // console.log(resData, "resData");
      // return;

      const transactionData = await prisma.$transaction(async (transaction) => {
        const answerData = resData.answers.map((item) => {
          return {
            question: { connect: { id: item.questionId } },
            option: item.answer,
          };
        });

        const userTableData = await transaction.user.findUnique({
          where: { id: resData.user_id },
        });

        const formdata = await transaction.reviewAssigneeAnswers.create({
          data: {
            user: { connect: { id: resData.user_id } },
            review: { connect: { id: resData.review_id } },
            review_assignee: { connect: { id: resData.review_assignee_id } },
            created_assignee_date: resData.created_assignee_date,
            organization: { connect: { id: userTableData.organization_id } },
            ReviewAssigneeAnswerOption: {
              create: answerData,
            },
          },
        });
        return { formdata };
      });

      const assignedByFromData = await prisma.review.findFirst({
        where: { id: transactionData.formdata.review_id },
      });
      const assignedByUser = await prisma.user.findFirst({
        where: { id: assignedByFromData.created_by },
      });
      const assignedUser = await prisma.user.findFirst({
        where: { id: transactionData.formdata.user_id },
      });

      const mailData = {
        from: process.env.SMTP_USER,
        to: assignedByUser.email,
        subject: ` ${assignedUser.first_name} has filled your review`,
        html: mailTemplate(
          ` ${assignedUser.first_name} has just filled your review , click here to see their response now .`
        ),
      };
      const assigneeData = await prisma.reviewAssignee.findFirst({
        where: {
          review_id: resData.review_id,
          assigned_to_id: resData.user_id,
        },
      });
      const UpdateAssignee = await prisma.reviewAssignee.update({
        where: {
          id: assigneeData.id,
        },
        data: {
          status: "answered",
        },
      });

      await mailService.sendMail(mailData, function (err, info) {
        if (err) console.log("failed");
        else console.log("successfull");
      });

      if (!transactionData.formdata || !transactionData) {
        prisma.$disconnect();
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error!",
          data: {},
        });
      }

      return res.status(201).json({
        message: "Review Saved Sucessfully.",
        data: transactionData.formdata,
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.formAssign.findMany({
        include: { created: true, assigned_to: true, form: true },
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
          created_by: resData.created_by,
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

import { PrismaClient } from "@prisma/client";
import { mailService } from "../../../lib/emailservice";

const prisma = new PrismaClient();

const defaultScaleQuestion = {
  questionText: "Rating",
  options: [{ optionText: "low" }, { optionText: "high" }],
  lowerLabel: 1,
  higherLabel: 10,
  open: false,
  type: "scale",
};

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      const templateData = await prisma.reviewTemplate.findUnique({
        where: { id: resData.template_id },
      });
      if (resData.review_type === "feedback") {
        templateData.form_data.questions.push(defaultScaleQuestion);
      }

      const transactionData = await prisma.$transaction(async (transaction) => {
        const questionData = templateData.form_data.questions.map((item) => {
          const optionData = item.options.map((opitem) => {
            if (item.type === "scale") {
              return {
                optionText: opitem.optionText,
                lowerLabel: item.lowerLabel.toString(),
                higherLabel: item.higherLabel.toString(),
              };
            } else {
              return {
                optionText: opitem.optionText,
                lowerLabel: "",
                higherLabel: "",
              };
            }
          });

          return {
            questionText: item.questionText,
            type: item.type,
            open: item.open,
            options: { create: optionData },
          };
        });

        const formdata = await transaction.reviewAssignTemplate.create({
          data: {
            user: { connect: { id: resData.created_by } },
            form_title: templateData.form_title,
            form_description: templateData.form_description,
            form_data: templateData.form_data,
            status: templateData.status,
            questions: {
              create: questionData,
            },
          },
        });

        let assigneeData = resData.assigned_to_id.map((item) => {
          return {
            assigned_to_id: item,
          };
        });

        let dataObj = {
          created: { connect: { id: resData.created_by } },
          review_name: resData.review_name,
          form: { connect: { id: formdata.id } },

          status: resData.status,
          frequency: resData.frequency,
          review_type: resData.review_type,
          organization: { connect: { id: resData.organization_id } },
          role: { connect: { id: resData.role_id } },
          parent_id: resData.created_by,
          is_published: resData.is_published,
          // ReviewAssignee: {
          //   create: assigneeData,
          // },
        };

        if (dataObj.is_published === "published") {
          dataObj.ReviewAssignee = {
            create: assigneeData,
          };
        }

        const savedData = await transaction.review.create({
          data: dataObj,
        });

        return { savedData };
      });

      if (transactionData.savedData.is_published === "published") {
        const assignedToData = await prisma.user.findMany({
          where: { id: { in: resData.assigned_to_id } },
        });

        const assignedFromData = await prisma.user.findUnique({
          where: { id: transactionData.savedData.created_by },
        });

        assignedToData.forEach(async (user) => {
          const mailData = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `New review assigned by ${assignedFromData.first_name}`,
            html: `${assignedFromData.first_name} has assigned you new review , please click here to help them now.`,
          };

          await mailService.sendMail(mailData, function (err, info) {
            if (err) console.log("failed");
            else console.log("successfull");
          });
        });
      }

      prisma.$disconnect();

      return res.status(201).json({
        message: "Review Assigned Successfully",
        data: transactionData.savedData,
        status: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.review.findMany({
        include: { created: true, form: true, ReviewAssignee: true },
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

      let assigneeData = resData.assigned_to_id.map((item) => {
        return {
          assigned_to_id: item,
        };
      });

      const data = await prisma.review.update({
        where: { id: resData.id },
        data: {
          created_by: resData.review_assigned_by,
          is_published: resData.is_published,
          ReviewAssignee: {
            create: assigneeData,
          },
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
    try {
      if (reqBody.id) {
        const deletaData = await prisma.review.delete({
          where: { id: reqBody.id },
          // data: {
          //   ReviewAssignee: {
          //     deleteMany: {},
          //   },
          // },
        });
        prisma.$disconnect();
        if (deletaData) {
          return res.status(200).json({
            status: 200,
            message: " Assign Review Deleted Successfully.",
          });
        }
        return res.status(400).json({
          status: 400,
          message: "Failed To Delete Record.",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

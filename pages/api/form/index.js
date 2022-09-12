import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      const transactionData = await prisma.$transaction(async (transaction) => {
        const questionData = resData.questions.map((item) => {
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

        const formdata = await transaction.reviewAssignTemplate.create({
          data: {
            user: { connect: { id: resData.user_id } },
            form_data: resData.form_data,
            form_title: resData.form_title,
            form_description: resData.form_description,
            status: resData.status,
            questions: {
              create: questionData,
            },
          },
        });

        return { formdata };
      });

      if (!transactionData.formdata || !transactionData) {
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error!",
          data: {},
        });
      }

      return res.status(201).json({
        message: "Form Saved Sucessfully.",
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
      const data = await prisma.reviewAssignTemplate.findMany({
        include: {
          questions: {
            include: { options: true },
          },
        },
      });

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

      return;
      // const transactionData = await prisma.$transaction(async (transaction) => {
      //   const questionData = resData.questions.map((item) => {
      //     const optionData = item.options.map((opitem) => {
      //       return {
      //         optionText: opitem.optionText,
      //       };
      //     });

      //     return {
      //       questionText: item.questionText,
      //       type: item.type,
      //       open: item.open,
      //       options: { create: optionData },
      //     };
      //   });
      //   const formdata = await transaction.reviewAssignTemplate.update({
      //     where: { id: resData.id },
      //     data: {
      //       user: { connect: { id: resData.user_id } },
      //       form_data: resData.form_data,
      //       form_title: resData.form_title,
      //       form_description: resData.form_description,
      //       status: resData.status,
      //       questions: {
      //         create: questionData,
      //       },
      //     },
      //   });

      //   return { formdata };
      // });

      // if (!transactionData.formdata || !transactionData) {
      //   prisma.$disconnect();
      //   return res.status(500).json({
      //     status: 500,
      //     message: "Internal Server Error!",
      //     data: {},
      //   });
      // }
      // prisma.$disconnect();
      // return res.status(201).json({
      //   message: "Form Updated Sucessfully.",
      //   data: transactionData.formdata,
      //   status: 200,
      // });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const deletaData = await prisma.reviewAssignTemplate.update({
        where: { id: reqBody.id },
        data: {
          status: false,
        },
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
}

export default (req, res) =>
  RequestHandler(req, res, handle, ["POST", "GET", "PUT", "DELETE"]);

import prisma from "../../../lib/prisma";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      const templateData = await prisma.reviewTemplate.create({
        data: {
          user: { connect: { id: resData.user_id } },

          form_title: resData.form_title,
          form_description: resData.form_description,
          form_data: resData.form_data,
          status: resData.status,
          // questions: {
          //   create: questionData,
          // },
        },
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "Saved  Successfully",
        data: templateData,
        status: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.reviewTemplate.findMany();

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Templates Retrieved",
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
      // console.log(resData, "resData");
      // return;

      const templateData = await prisma.reviewTemplate.update({
        where: { id: resData.id },
        data: {
          user: { connect: { id: resData.user_id } },

          form_title: resData.form_title,
          form_description: resData.form_description,
          form_data: resData.form_data,
          status: resData.status,
          // questions: {
          //   create: questionData,
          // },
        },
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "Updated   Successfully",
        data: templateData,
        status: 200,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const deletaData = await prisma.reviewTemplate.update({
        where: { id: reqBody.id },
        data: {
          status: false,
        },
      });

      prisma.$disconnect();
      if (deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Template Deleted Successfully.",
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

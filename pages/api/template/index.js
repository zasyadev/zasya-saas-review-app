import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    const resData = req.body;

    const templateData = await prisma.reviewTemplate.create({
      data: {
        user: { connect: { id: resData.user_id } },

        form_title: resData.form_title,
        form_description: resData.form_description,
        form_data: resData.form_data,
        status: resData.status,
        default_template: resData.default_template,
        // questions: {
        //   create: questionData,
        // },
      },
    });

    return res.status(201).json({
      message: "Saved  Successfully",
      data: templateData,
      status: 200,
    });
  } else if (req.method === "GET") {
    const data = await prisma.reviewTemplate.findMany();

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "All Templates Retrieved",
      });
    }

    return res.status(404).json({ status: 404, message: "No Record Found" });
  } else if (req.method === "PUT") {
    const resData = req.body;

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

    return res.status(201).json({
      message: "Updated   Successfully",
      data: templateData,
      status: 200,
    });
  } else if (req.method === "DELETE") {
    const reqBody = req.body;

    if (reqBody.id) {
      const deletaData = await prisma.reviewTemplate.update({
        where: { id: reqBody.id },
        data: {
          status: false,
          delete_date: new Date(),
        },
      });

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
  }
}

export default (req, res) =>
  RequestHandler(req, res, handle, ["POST", "GET", "PUT", "DELETE"]);

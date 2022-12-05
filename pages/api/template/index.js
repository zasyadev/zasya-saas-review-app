import { RequestHandler } from "../../../lib/RequestHandler";
import { TEMPLATE_SCHEMA } from "../../../yup-schema/template";

async function handle(req, res, prisma, user) {
  if (req.method === "POST") {
    const resData = req.body;
    const { id: userId } = user;

    const templateData = await prisma.reviewTemplate.create({
      data: {
        user: { connect: { id: userId } },
        form_title: resData.form_title,
        form_description: resData.form_description,
        form_data: resData.form_data,
        status: resData.status,
        default_template: resData.default_template,
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
    const { id: userId } = user;
    const templateData = await prisma.reviewTemplate.update({
      where: { id: resData.id },
      data: {
        user: { connect: { id: userId } },
        form_title: resData.form_title,
        form_description: resData.form_description,
        form_data: resData.form_data,
        status: resData.status,
        default_template: resData.default_template,
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
const functionHandle = (req, res) =>
  RequestHandler({
    req,
    res,
    callback: handle,
    allowedMethods: ["POST", "GET", "PUT", "DELETE"],
    protectedRoute: true,
    schemaObj: TEMPLATE_SCHEMA,
  });

export default functionHandle;

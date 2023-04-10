import { BadRequestException } from "../../../lib/BadRequestExcpetion";
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
    if (!templateData) throw BadRequestException("Record not saved");

    return res.status(201).json({
      message: "Saved Successfully",
      data: templateData,
    });
  } else if (req.method === "GET") {
    const data = await prisma.reviewTemplate.findMany();

    if (!data) throw BadRequestException("No record found");

    return res.status(200).json({
      data: data,
      message: "All Templates Retrieved",
    });
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

    if (!templateData) throw BadRequestException("Record not updated");

    return res.status(201).json({
      message: "Updated Successfully",
      data: templateData,
    });
  } else if (req.method === "DELETE") {
    const reqBody = req.body;

    const deletaData = await prisma.reviewTemplate.update({
      where: { id: reqBody.id },
      data: {
        status: false,
        delete_date: new Date(),
      },
    });

    if (!deletaData) throw BadRequestException("Failed to delete record");

    return res.status(200).json({
      message: "Template Deleted Successfully.",
    });
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

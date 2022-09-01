import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res, prisma) {
  if (req.method === "POST") {
    const resData = JSON.parse(req.body);

    let userobj = {
      name: resData.name,
      category: resData.category,
      status: resData.status,
      user: { connect: { id: resData.user_id } },
    };

    const savedData = await prisma.groups.create({
      data: userobj,
    });

    return res.status(201).json({
      message: "Group Saved Successfully",
      data: savedData,
      status: 200,
    });
  } else if (req.method === "GET") {
    const data = await prisma.groups.findMany();

    if (data) {
      return res.status(200).json({
        status: 200,
        data: data,
        message: "All Groups Retrieved",
      });
    }
  } else if (req.method === "PUT") {
    const resData = JSON.parse(req.body);

    const data = await prisma.groups.update({
      where: { id: resData.id },
      data: {
        name: resData.name,
        category: resData.category,
        status: resData.status,
        user: { connect: { id: resData.user_id } },
      },
    });

    return res.status(200).json({
      message: "Groups Updated Successfully.",
      status: 200,
      data: data,
    });
  } else if (req.method === "DELETE") {
    const reqBody = JSON.parse(req.body);

    if (reqBody.id) {
      const deletaData = await prisma.groups.delete({
        where: { id: reqBody.id },
      });

      if (deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Group Deleted Successfully.",
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

import prisma from "../../../lib/prisma";

export default async (req, res) => {
  if (req.method === "POST") {
    try {
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

      prisma.$disconnect();

      return res.status(201).json({
        message: "Group Saved Successfully",
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
      const data = await prisma.groups.findMany();

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Groups Retrieved",
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

      const data = await prisma.groups.update({
        where: { id: resData.id },
        data: {
          name: resData.name,
          category: resData.category,
          status: resData.status,
          user: { connect: { id: resData.user_id } },
        },
      });

      prisma.$disconnect();

      return res.status(200).json({
        message: "Groups Updated Successfully.",
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
      const deletaData = await prisma.groups.delete({
        where: { id: reqBody.id },
      });
      prisma.$disconnect();
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
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

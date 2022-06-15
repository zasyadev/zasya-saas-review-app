import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const resData = JSON.parse(req.body);

      // let userobj = {
      //   group: { connect: { id: resData.group_id } },
      //   employee: { connect: { id: resData.employee_id } },
      //   is_manager: resData.is_manager,
      // };

      let tagsobj = {
        user: { connect: { id: resData.employee_id } },
        tags: resData.tags,
      };

      // const savedData = await prisma.groupsEmployees.create({
      //   data: userobj,
      // });

      const savedTagsData = await prisma.tagsEmployees.create({
        data: tagsobj,
      });

      prisma.$disconnect();

      return res.status(201).json({
        message: "Members Saved Successfully",
        data: savedTagsData,
        status: 200,
      });
    } catch (error) {
      if (error.code === "P2014") {
        return res
          .status(409)
          .json({ error: error, message: "Duplicate Employee" });
      } else if (error.code === "P2002") {
        return res
          .status(410)
          .json({ error: error, message: "Duplicate Employee" });
      } else {
        return res
          .status(500)
          .json({ error: error, message: "Internal Server Error" });
      }
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.tagsEmployees.findMany({
        include: {
          user: {
            select: {
              first_name: true,
              email: true,
              status: true,
              last_name: true,
            },
          },
          // group: true,
        },
      });

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Members Retrieved",
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

      const data = await prisma.tagsEmployees.update({
        where: { id: resData.id },
        data: {
          user_id: resData.employee_id,

          tags: resData.tags,
        },
      });

      prisma.$disconnect();

      return res.status(200).json({
        message: "Members Updated Successfully.",
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
      const deletaData = await prisma.tagsEmployees.delete({
        where: { id: reqBody.id },
      });
      prisma.$disconnect();
      if (deletaData) {
        return res.status(200).json({
          status: 200,
          message: "Members Deleted Successfully.",
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

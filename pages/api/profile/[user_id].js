import { PrismaClient } from "@prisma/client";
const fs = require("fs");

const prisma = new PrismaClient();

export default async (req, res) => {
  const { user_id } = req.query;
  try {
    if (req.method === "GET") {
      if (user_id) {
        const userData = await prisma.userDetails.findUnique({
          where: { user_id: user_id },
          include: {
            user: {
              select: {
                first_name: true,
              },
            },
          },
        });

        prisma.$disconnect();
        if (userData) {
          return res.status(200).json({
            status: 200,
            data: userData,
            message: "All Data Retrieved",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No User Details Found" });
      }
    } else if (req.method === "POST") {
      try {
        const reqBody = JSON.parse(req.body);

        if (user_id && reqBody.first_name) {
          const transactionData = await prisma.$transaction(
            async (transaction) => {
              const userTable = await transaction.user.update({
                where: { id: user_id },
                data: {
                  first_name: reqBody.first_name,
                },
              });

              const userDetailData = await transaction.userDetails.findUnique({
                where: { user_id: user_id },
              });
              let userDeatilsTable = {};
              if (userDetailData) {
                let dataObj = {
                  address1: reqBody.address1 ?? "",
                  address2: reqBody.address2 ?? "",
                  about: reqBody.about ?? "",
                  pin_code: reqBody.pin_code ?? "",
                  mobile: reqBody.mobile ?? "",
                };
                if (reqBody.imageName) {
                  // if (userDetailData.image) {
                  //   let path = `./public/static/media/profile/${userDetailData.image}`;

                  //   fs.unlink(path, (err) => {
                  //     if (err) {
                  //       return err;
                  //     }
                  //   });
                  // }
                  dataObj.image = reqBody.imageName;
                }

                userDeatilsTable = await transaction.userDetails.update({
                  where: { id: userDetailData.id },
                  data: dataObj,
                });
              } else {
                userDeatilsTable = await transaction.userDetails.create({
                  data: {
                    user: { connect: { id: user_id } },
                    image: reqBody.imageName ?? "",
                    address1: reqBody.address1 ?? "",
                    address2: reqBody.address2 ?? "",
                    about: reqBody.about ?? "",
                    pin_code: reqBody.pin_code ?? "",
                    mobile: reqBody.mobile ?? "",
                  },
                });
              }

              return { userDeatilsTable };
            }
          );
          prisma.$disconnect();
          if (transactionData.userDeatilsTable) {
            return res.status(201).json({
              message: "Profile Updated Successfully",
              data: transactionData.userDeatilsTable,
              status: 200,
            });
          }
        } else {
          return res.status(400).json({
            message: "User Not Found",

            status: 400,
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: error,
          message: "Internal Server Error",
        });
      }
    } else {
      return res.status(405).json({
        message: "Method Not allowed",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal Server Error" });
  }
};

import prisma from "../../../lib/prisma";

export default async (req, res) => {
  try {
    const reqBody = req.body;
    if (req.method === "POST" && reqBody.id) {
      let data = await prisma.userNotification.update({
        where: { id: reqBody.id },
        data: {
          read_at: new Date(),
        },
      });

      prisma.$disconnect();
      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "Notification Updated",
        });
      }
      return res.status(400).json({
        status: 400,

        message: "No Record Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

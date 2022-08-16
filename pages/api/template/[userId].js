import prisma from "../../../lib/prisma";

export default async (req, res) => {
  const { userId } = req.query;
  try {
    if (req.method === "GET") {
      if (userId) {
        const data = await prisma.reviewTemplate.findMany({
          where: { user_id: userId },
        });
        prisma.$disconnect();
        if (data) {
          return res.status(200).json({
            status: 200,
            data: data,
            message: "Templates Retrieved",
          });
        }

        return res
          .status(404)
          .json({ status: 404, message: "No Record Found" });
      }
    } else {
      return res.status(405).json({
        message: "Method Not allowed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

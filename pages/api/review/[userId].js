import { PrismaClient } from "@prisma/client";
const scheduler = require("node-schedule");

const prisma = new PrismaClient();

export default async (req, res) => {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      const data = await prisma.reviewAssignee.findMany({
        where: { assigned_by_id: userId },
        include: { assigned_by: true, assigned_to: true, form: true },
      });

      //   let montlyJob = scheduler.scheduleJob("*/5 * * * * *", function () {
      //     console.log("I run the first day of the month");
      //   });
      //   console.log(montlyJob, "monthly job");
      //   scheduler.gracefulShutdown();

      if (data) {
        return res.status(200).json({
          status: 200,
          data: data,
          message: "All Data Retrieved",
        });
      }

      return res.status(404).json({ status: 404, message: "No Record Found" });
    }
  } else {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }
};

import { PrismaClient } from "@prisma/client";
import moment from "moment";
const schedule = require("node-schedule");
const prisma = new PrismaClient();

export function ReviewScheduler({ savedData, resData }) {
  let date = moment(savedData.created_date);
  if (savedData.frequency === "daily") {
    date = moment(date).add(1, "days");
  } else if (savedData.frequency === "weekly") {
    date = moment(date).add(7, "days");
  } else if (savedData.frequency === "monthly") {
    date = moment(date).add(30, "days");
  }
  let scheduleDate = new Date(date);

  schedule.scheduleJob(savedData.id, scheduleDate, function () {
    console.log("Time for sdfsdf!", savedData.id);
    let newAssignData = [];
    let assignData = resData.assigned_to_id.forEach((item) => {
      newAssignData.push({
        review: { connect: { id: savedData.id } },
        assigned_to: { connect: { id: item } },
      });
    });

    newAssignData.map(async (item) => {
      return await prisma.reviewAssignee.create({
        data: item,
      });
    });
  });
}

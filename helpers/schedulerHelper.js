import { PrismaClient } from "@prisma/client";
import moment from "moment";
const schedule = require("node-schedule");
const prisma = new PrismaClient();

export function ReviewScheduler({ savedData, resData }) {
  if (savedData.created_date) {
    let date = new Date(savedData.created_date);
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let week = date.getDay();
    let day = date.getDate();
    let scheduleDate = "";
    if (savedData.frequency === "daily") {
      scheduleDate = `${minutes} ${hour} * * * `;
    } else if (savedData.frequency === "weekly") {
      scheduleDate = `${minutes} ${hour} * * ${week} `;
    } else if (savedData.frequency === "monthly") {
      scheduleDate = `${minutes} ${hour} ${day} * * `;
    }

    let a = "*";
    let testDate = `${a} * * * * `;
    // console.log("testDate", testDate);
    schedule.scheduleJob(savedData.id, testDate, function () {
      // console.log("scheduleDate", scheduleDate);
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
}

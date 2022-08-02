const { PrismaClient } = require("@prisma/client");
const schedule = require("node-schedule");
// var cron = require("node-cron");

const prisma = new PrismaClient();

export function ReviewScheduler({ reviewData, asigneeList }) {
  if (reviewData.created_date) {
    let date = new Date(reviewData.created_date);
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let week = date.getDay();
    let day = date.getDate();
    let scheduleDate = "";
    if (reviewData.frequency === "daily") {
      scheduleDate = `${minutes} ${hour} * * * `;
    } else if (reviewData.frequency === "weekly") {
      scheduleDate = `${minutes} ${hour} * * ${week} `;
    } else if (reviewData.frequency === "monthly") {
      scheduleDate = `${minutes} ${hour} ${day} * * `;
    }

    // let a = "*";
    // let testDate = `${a} * * * * `;

    schedule.scheduleJob(reviewData.id, scheduleDate, function () {
      let newAssignData = [];
      // console.log("yess");
      let assignData = asigneeList.forEach((item) => {
        newAssignData.push({
          review: { connect: { id: reviewData.id } },
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

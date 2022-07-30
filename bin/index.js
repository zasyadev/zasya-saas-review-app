const schedule = require("node-schedule");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function scheduleStart() {
  // try {
  //   const scheduleJobs = await prisma.scheduleJobs.findMany({
  //     where: { status: true },
  //     include: { review: true },
  //   });

  //   // const scheduleJobs = await prisma.scheduleJobs.update({
  //   //   where: { id: 8 },
  //   //   data: {
  //   //     status: false,
  //   //   },
  //   // });

  //   if (scheduleJobs.length > 0) {
  //     scheduleJobs.forEach((item) => {
  //       console.log(item, "item");
  //       if (item.review.created_date) {
  //         let date = new Date(item.review.created_date);
  //         let hour = date.getHours();
  //         let minutes = date.getMinutes();
  //         let week = date.getDay();
  //         let day = date.getDate();
  //         let scheduleDate = "";
  //         if (item.review.frequency === "daily") {
  //           scheduleDate = `${minutes} ${hour} * * * `;
  //         } else if (item.review.frequency === "weekly") {
  //           scheduleDate = `${minutes} ${hour} * * ${week} `;
  //         } else if (item.review.frequency === "monthly") {
  //           scheduleDate = `${minutes} ${hour} ${day} * * `;
  //         }

  //         let a = "*";
  //         let testDate = `${a} * * * * `;

  //         schedule.scheduleJob(item.review.id, testDate, function () {
  //           let newAssignData = [];
  //           console.log("yess");
  //           let assignData = item.assignee_list.forEach((asigneeItem) => {
  //             newAssignData.push({
  //               review: { connect: { id: item.review.id } },
  //               assigned_to: { connect: { id: asigneeItem } },
  //             });
  //           });

  //           newAssignData.map(async (data) => {
  //             return await prisma.reviewAssignee.create({
  //               data: data,
  //             });
  //           });
  //         });
  //       }
  //     });
  //   }
  //   return true;
  // } catch (error) {
  //   console.error(error);
  // }
  var cron = require("node-cron");

  cron.schedule(`* * * * * `, function () {
    console.log("yess cron");
  });
}
scheduleStart();

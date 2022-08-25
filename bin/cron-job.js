const axios = require("axios").default;
require("dotenv").config();
const schedule = require("node-schedule");

async function cronJobStart() {
  try {
    schedule.scheduleJob("daily_schedule", "30 4 * * *", async function () {
      await axios.post(`${process.env.NEXT_APP_URL}api/cronjobs/dailycron`, {
        password: process.env.NEXT_APP_CRON_PASSWORD,
      });
      await axios.post(
        `${process.env.NEXT_APP_URL}api/cronjobs/dailyfrequencycron`,
        {
          password: process.env.NEXT_APP_CRON_PASSWORD,
        }
      );
    });
    schedule.scheduleJob("weekly_schedule", "30 4 * * 1", async function () {
      await axios.post(`${process.env.NEXT_APP_URL}api/cronjobs/weeklycron`, {
        password: process.env.NEXT_APP_CRON_PASSWORD,
      });
      await axios.post(
        `${process.env.NEXT_APP_URL}api/cronjobs/weeklyfrequencycron`,
        {
          password: process.env.NEXT_APP_CRON_PASSWORD,
        }
      );
    });
    schedule.scheduleJob("monthly_schedule", "30 4 1 * *", async function () {
      await axios.post(`${process.env.NEXT_APP_URL}api/cronjobs/monthlycron`, {
        password: process.env.NEXT_APP_CRON_PASSWORD,
      });
      await axios.post(
        `${process.env.NEXT_APP_URL}api/cronjobs/monthlyfrequencycron`,
        {
          password: process.env.NEXT_APP_CRON_PASSWORD,
        }
      );
    });

    // schedule.scheduleJob("weekly_schedule", "* * * * *", async function () {
    //   await axios.post(`${process.env.NEXT_APP_URL}api/cronjobs/monthlycron`, {
    //     password: process.env.NEXT_APP_CRON_PASSWORD,
    //   });
    // });
  } catch (error) {
    console.log(error);
  }
}
cronJobStart();

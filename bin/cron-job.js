const axios = require("axios");
require("dotenv").config();
const schedule = require("node-schedule");

const APPLAUD_TYPE = "APPLAUD";
const REVIEW_TYPE = "REVIEW";
const BASE_URL = process.env.NEXT_APP_URL;
const CRON_PASSWORD = process.env.NEXT_APP_CRON_PASSWORD;

async function cronJobStart() {
  try {
    schedule.scheduleJob("daily_schedule", "30 4 * * *", async function () {
      await axios.post(`${BASE_URL}api/cronjobs/dailycron`, {
        password: CRON_PASSWORD,
      });

      await axios.post(`${BASE_URL}api/cronjobs/goalsnotifications`, {
        password: CRON_PASSWORD,
      });

      await axios.post(`${BASE_URL}api/cronjobs/reviewfrequencycron`, {
        password: CRON_PASSWORD,
      });
    });
    schedule.scheduleJob("weekly_schedule", "30 4 * * 1", async function () {
      await axios.post(`${BASE_URL}api/cronjobs/weeklycron`, {
        password: CRON_PASSWORD,
        type: APPLAUD_TYPE,
      });
    });
    schedule.scheduleJob("weekly_schedule", "30 4 * * 3", async function () {
      await axios.post(`${BASE_URL}api/cronjobs/weeklycron`, {
        password: CRON_PASSWORD,
        type: REVIEW_TYPE,
      });
    });
    schedule.scheduleJob("monthly_schedule", "30 4 1 * *", async function () {
      await axios.post(`${BASE_URL}api/cronjobs/monthlycron`, {
        password: CRON_PASSWORD,
      });

      await axios.post(`${BASE_URL}api/cronjobs/followupcron`, {
        password: CRON_PASSWORD,
      });
    });
    schedule.scheduleJob("monthly_schedule", "30 4 25 * *", async function () {
      await axios.post(`${BASE_URL}api/cronjobs/goalsmonthlynotifications`, {
        password: CRON_PASSWORD,
      });
    });
  } catch (error) {
    console.error(error?.message);
  }
}
cronJobStart();

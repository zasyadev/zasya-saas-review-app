import { randomString } from "./randomString";
const { google } = require("googleapis");

// const SCOPES = [
//   "https://www.googleapis.com/auth/calendar",
//   "https://www.googleapis.com/auth/calendar.events",
// "https://www.googleapis.com/auth/plus.login"
// ];

const GOOGLE_CALENDER_ID = process.env.NEXT_APP_GOOGLE_CALENDER_ID;
const GOOGLE_CALENDER_KEY = process.env.NEXT_APP_GOOGLE_CALENDER_KEY;
const GOOGLE_CLIENT_ID = process.env.NEXT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_APP_GOOGLE_CLIENT_SECRET;
const GOOGLE_CLIENT_REFRESH_TOKEN =
  process.env.NEXT_APP_GOOGLE_CLIENT_REFRESH_TOKEN;
const TIME_ZONE = "Asia/Kolkata";

async function loadSavedCredentialsIfExist() {
  try {
    return google.auth.fromJSON({
      type: "authorized_user",
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_CLIENT_REFRESH_TOKEN,
    });
  } catch (err) {
    return null;
  }
}

// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: "authorized_user",
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });

//   await fs.writeFile(TOKEN_PATH, payload);
// }

async function authorize() {
  try {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    // client = await authenticate({
    //   scopes: SCOPES,
    //   keyfilePath: CREDENTIALS_PATH,
    // });
    // if (client.credentials) {
    //   await saveCredentials(client);
    // }
  } catch (error) {
    console.log({ error });
  }
}

export async function CreateGoogleCalenderApi({
  emailsList,
  meeetingStartTime,
  meetingTitle,
  meeetingEndTime,
}) {
  async function createEvents(auth) {
    const calendar = google.calendar({ version: "v3", auth });
    const event = {
      summary: meetingTitle,
      description: "",
      attendees: emailsList,
      start: {
        dateTime: meeetingStartTime,
        timeZone: TIME_ZONE,
      },
      end: {
        dateTime: meeetingEndTime,
        timeZone: TIME_ZONE,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
          requestId: randomString(8),
        },
      },
    };
    // We make a request to Google Calendar API.
    calendar.events.insert(
      {
        auth: auth,
        calendarId: GOOGLE_CALENDER_ID,
        resource: event,
        key: GOOGLE_CALENDER_KEY,
        conferenceDataVersion: 1,
        sendUpdates: "all",
        sendNotifications: true,
      },
      function (err, event) {
        if (err) {
          // console.log(
          //   "There was an error contacting the Calendar service: " + err
          // );
          return;
        }
        // console.log("Event created: %s", event.data.htmlLink);
      }
    );
  }

  authorize().then(createEvents).catch(console.error);
}

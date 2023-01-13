const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const GOOGLE_CALENDER_ID = process.env.GOOGLE_CALENDER_ID;
const GOOGLE_CALENDER_KEY = process.env.GOOGLE_CALENDER_KEY;

export async function GoogleCalenderApi() {
  async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }

  async function listEvents(auth) {
    const calendar = google.calendar({ version: "v3", auth });
    // const res = await calendar.events.list({
    //   calendarId:
    //     "c_40d3200aea887ed7163bbc19761ee5066c71725a2ea47e2f6a559cf5a41f87da@group.calendar.google.com",
    //   timeMin: new Date().toISOString(),
    //   maxResults: 10,
    //   singleEvents: true,
    //   orderBy: "startTime",
    // });
    // const events = res.data.items;
    // if (!events || events.length === 0) {
    //   console.log("No upcoming events found.");
    //   return;
    // }
    // console.log("Upcoming 10 events:");
    // events.map((event, i) => {
    //   const start = event.start.dateTime || event.start.date;
    //   console.log(`${start} - ${event.summary}`);
    // });

    const event = {
      summary: "Default event",
      description: "Google add event testing.",
      attendees: [{ email: "nishant@zasyasolutions.com" }],
      start: {
        dateTime: "2023-01-14T01:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2023-01-14T02:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
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
      },

      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created: %s", event.data.htmlLink);
      }
    );
  }

  authorize().then(listEvents).catch(console.error);
}

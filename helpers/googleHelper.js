const fs = require("fs");
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

async function loadSavedCredentialsIfExist() {
  try {
    // const content = fs.readFileSync(TOKEN_PATH, "utf8");
    const content = fs.readFile(TOKEN_PATH, function (err, data) {
      if (err) throw err;
      console.log(data);
      return data;
    });

    console.log({ content });
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  // const content = fs.readFileSync(CREDENTIALS_PATH, "utf8");
  const content = fs.readFile(CREDENTIALS_PATH, function (err, data) {
    if (err) throw err;
    console.log(data);
    return data;
  });
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  console.log({ content });
  // fs.writeFileSync(TOKEN_PATH, payload);
  fs.writeFile(TOKEN_PATH, payload, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();

  if (client) {
    return client;
  }
  console.log({ CREDENTIALS_PATH });
  const content = fs.readFile(CREDENTIALS_PATH, function (err, data) {
    if (err) throw err;
    console.log(data);
    return data;
  });
  console.log({ content }, "dhfvdxfhgxdf");
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  console.log({ client });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
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
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: meeetingEndTime,
        timeZone: "Asia/Kolkata",
      },
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

  authorize().then(createEvents).catch(console.error);
}

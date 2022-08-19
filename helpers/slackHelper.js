import React, { useEffect } from "react";

const SLACK_USER_TOKEN = process.env.NEXT_APP_SLACK_USER_TOKEN;
const SLACK_BOT_TOKEN = process.env.NEXT_APP_SLACK_BOT_TOKEN;

export async function SlackHelper({ data }) {
  let a = { text: "Hello from app World!" };
  console.log(a, "a");
  const resData = await fetch(
    "https://hooks.slack.com/services/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",
    {
      method: "POST",
      body: JSON.stringify(a),
    }
  )
    .then((response) => response.json())
    .then((response) => {
      if (response.ok) {
        console.log(response, "response");
      }
    })
    .catch((err) => {
      console.log(error);
    });
  return;
}

export async function SlackUserList() {
  const resData = await fetch("https://slack.com/api/users.list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + SLACK_USER_TOKEN,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.ok) {
        return response.members;
      }
      return [];
    })
    .catch((err) => {
      console.log(error);
      return [];
    });
  return resData;
}

export async function SlackPostMessage({ channel, text }) {
  const resData = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + SLACK_BOT_TOKEN,
    },
    body: JSON.stringify({
      channel: channel,
      text: text,
    }),
  });

  return;
}

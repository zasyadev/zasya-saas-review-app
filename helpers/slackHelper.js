const SLACK_USER_TOKEN = process.env.NEXT_APP_SLACK_USER_TOKEN;
const SLACK_BOT_TOKEN = process.env.NEXT_APP_SLACK_BOT_TOKEN;

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
      console.log(err);
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

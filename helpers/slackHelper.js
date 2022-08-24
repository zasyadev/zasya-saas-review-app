import httpService from "../lib/httpService";

const SLACK_USER_TOKEN = process.env.NEXT_APP_SLACK_USER_TOKEN;
const SLACK_BOT_TOKEN = process.env.NEXT_APP_SLACK_BOT_TOKEN;

export async function SlackUserList() {
  const resData = await httpService
    .get("https://slack.com/api/users.list", {
      headers: {
        Authorization: "Bearer " + SLACK_USER_TOKEN,
      },
    })
    .then(({ data: response }) => {
      return response.members;
    })
    .catch((err) => {
      return [];
    });
  return resData;
}

export async function SlackPostMessage({ channel, text, blocks }) {
  const resData = await httpService.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: channel,

      blocks: blocks,
      text: text,
    },
    {
      headers: {
        Authorization: "Bearer " + SLACK_BOT_TOKEN,
      },
    }
  );
  return;
}

export function CustomizeSlackMessage({
  header,
  user = "",
  link,
  by = "",
  text = "",
}) {
  let customText = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: header,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: by,
        },
        {
          type: "mrkdwn",
          text: `*${user}*`,
        },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review App",
            emoji: true,
          },
          value: "details",
          url: link,
          action_id: "button-action",
        },
      ],
    },
  ];
  if (text) {
    customText.splice(2, 0, {
      type: "section",
      text: {
        type: "mrkdwn",
        text: text,
      },
    });
  }
  return customText;
}

export function CustomizeCronSlackMessage({ header, link }) {
  let customText = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: header,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Review App",
            emoji: true,
          },
          value: "details",
          url: link,
          action_id: "button-action",
        },
      ],
    },
  ];
  return customText;
}

export function CustomizeMonthlyCronSlackMessage({
  applaudCount,
  reviewCount,
}) {
  let customText = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Your Monthly Activities",
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Applaud Assigned",
        },
        {
          type: "mrkdwn",
          text: `*${applaudCount}*`,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Review Given",
        },
        {
          type: "mrkdwn",
          text: `*${reviewCount}*`,
        },
      ],
    },
  ];
  return customText;
}

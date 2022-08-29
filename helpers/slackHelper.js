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
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Go to Review App",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Click Me",
        },
        value: "click_me_123",
        url: link,
        action_id: "button-action",
        style: "primary",
      },
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
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Go to Review App",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Click Me",
        },
        value: "click_me_123",
        style: "primary",
        url: link,
        action_id: "button-action",
      },
    },
  ];
  return customText;
}

export function CustomizeMonthlyCronSlackMessage({
  applaudCount,
  reviewCreatedCount,
  reviewAnsweredCount,
}) {
  let customText = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: ":calendar: | Your Monthly Activities | :calendar:  ",
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Applaud Given",
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
          text: "Review Assigned",
        },
        {
          type: "mrkdwn",
          text: `*${reviewCreatedCount}*`,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Review Answered",
        },
        {
          type: "mrkdwn",
          text: `*${reviewAnsweredCount}*`,
        },
      ],
    },
  ];
  return customText;
}

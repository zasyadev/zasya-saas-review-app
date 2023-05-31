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
  const resData = await httpService
    .post(
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
    )
    .then(({ data: response }) => {
      // console.log(response);
    })
    .catch((err) => {
      // console.log(response);
    });
  return;
}

export function CustomizeSlackMessage({
  header,
  user = "",
  link,
  by = "",
  text = "",
  btnText = "Review App",
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
            text: btnText,
            emoji: true,
          },
          value: "details",
          url: link,
          action_id: "button-action",
          style: "primary",
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
          style: "primary",
        },
      ],
    },
  ];
  return customText;
}

export function CustomizeMonthlyCronSlackMessage({
  applaudCount,
  reviewCreatedCount,
  reviewAnsweredCount,
  goalsCount,
  followUpCount,
}) {
  let customText = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Your Monthly Activities | :calendar:  ",
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Review Assigned* \n *${reviewCreatedCount}*`,
        },
        {
          type: "mrkdwn",
          text: `*Review Answered* \n *${reviewAnsweredCount}*`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Applaud Given* \n *${applaudCount}*`,
        },
        {
          type: "mrkdwn",
          text: `*Goals Assigned* \n *${goalsCount}*`,
        },
      ],
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Follow Ups Created* \n *${followUpCount}*`,
        },
      ],
    },
  ];
  return customText;
}

export function WeeklyCustomizeReviewMessage({
  header,
  link,
  text = "",
  btnText = "Create",
  subText = "",
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
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${subText}*`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: text,
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
            text: btnText,
            emoji: true,
          },
          value: "details",
          url: link,
          action_id: "button-action",
          style: "primary",
        },
      ],
    },
  ];
  return customText;
}

export function GoalCustomizeMessage({
  header,
  link,
  btnText = "Goals",
  subText = "",
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
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${subText}*`,
      },
    },

    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: btnText,
            emoji: true,
          },
          value: "details",
          url: link,
          action_id: "button-action",
          style: "primary",
        },
      ],
    },
  ];
  return customText;
}

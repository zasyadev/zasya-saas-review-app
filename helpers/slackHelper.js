import React, { useEffect } from "react";

export async function SlackHelper({ data }) {
  let a = { text: "Hello from app World!" };
  console.log(a, "a");
  const resData = await fetch(
    "https://hooks.slack.com/services/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",
    {
      method: "POST",
      body: JSON.stringify(a),
    }
  );
  return;
}

import { notification } from "antd";

export function openNotificationBox(
  type,
  message,
  duration,

  key = "error",
  description = null
) {
  notification[type]({
    key,
    message: message,
    duration: duration,
    description: description,
  });
}

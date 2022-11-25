import { notification } from "antd";

export function openNotificationBox(type, message, duration, key = "error") {
  notification[type]({
    key,
    message: message,
    duration: duration,
  });
}

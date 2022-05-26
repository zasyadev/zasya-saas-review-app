import { notification } from "antd";

export function openNotificationBox(type, message, duration) {
  notification[type]({
    message: message,
    duration: duration,
  });
}

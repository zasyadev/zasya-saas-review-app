import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getNotificationPopupTime,
  setNotificationPopupTime,
} from "../../../lib/utils";

export default function HeaderNotification({ user, dashBoardData }) {
  const [notificationHeader, setNotificationHeader] = useState(false);

  const getUserWeeklyReviewCount = () => {
    if (user) {
      const notificationopupTime = getNotificationPopupTime();
      const todayDate = moment();
      if (
        notificationopupTime &&
        todayDate.diff(notificationopupTime, "days") < 3
      )
        return;
      setNotificationHeader(true);
      setNotificationPopupTime(moment());
    }
  };

  const handleClose = () => {
    setNotificationHeader(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      getUserWeeklyReviewCount();
    }, 1000);
    return () => clearTimeout(timerId);
  }, [user]);
  return (
    notificationHeader && (
      <div className="bg-brandSkin-100 p-4  rounded-md relative ">
        <div
          className="absolute right-3 top-1 cursor-pointer"
          onClick={() => handleClose()}
        >
          <CloseOutlined />
        </div>
        <p className="font-bold  mb-0 uppercase">Hi {user.first_name}</p>
        <p className="mb-0 font-medium">
          You have{" "}
          <span className="font-semibold text-primary-green">
            {dashBoardData.pendingGoals}
          </span>{" "}
          goals pending as you have completed{" "}
          <span className="font-semibold text-primary-green">
            {dashBoardData.goalsProgress}%
          </span>{" "}
          of goals.
        </p>
      </div>
    )
  );
}

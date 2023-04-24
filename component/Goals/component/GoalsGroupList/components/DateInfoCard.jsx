import { CalendarOutlined } from "@ant-design/icons";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import { DATE_FORMAT_FULL } from "../../../../../helpers/dateHelper";

const DateInfoCard = ({ endDate }) => {
  if (!endDate) return null;
  const daysDiff = moment(endDate).diff(moment(), "days");

  return daysDiff < 0 ? (
    <p className="text-xs font-semibold text-red-700 mb-1 w-28">
      <CalendarOutlined className="text-lg mr-1" />
      {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  ) : (
    <p
      className={clsx("text-xs font-semibold text-gray-600 mb-1 w-28", {
        "text-yellow-600": daysDiff < 2,
      })}
    >
      <CalendarOutlined className="text-lg mr-1" />
      {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  );
};

export default DateInfoCard;

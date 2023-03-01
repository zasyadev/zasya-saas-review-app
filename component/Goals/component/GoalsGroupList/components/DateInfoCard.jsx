import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import React from "react";
import { DATE_FORMAT_FULL } from "../../../../../helpers/dateHelper";

const DateInfoCard = ({ endDate }) => {
  if (!endDate) return null;
  const daysDiff = moment(endDate).diff(moment(), "days");

  return daysDiff < 0 ? (
    <p className={` text-xs font-semibold text-red-700 mb-1`}>
      <CalendarOutlined className="text-lg mr-1" />{" "}
      {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  ) : (
    <p
      className={` text-xs font-semibold text-gray-600 mb-1 ${
        daysDiff < 2 ? "text-yellow-600" : ""
      }`}
    >
      <CalendarOutlined className="text-lg mr-1" />{" "}
      {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  );
};

export default DateInfoCard;

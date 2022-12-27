import moment from "moment";
import React from "react";
import { DATE_FORMAT_FULL } from "../../../../../helpers/dateHelper";

const DateInfoCard = ({ endDate }) => {
  if (!endDate) return null;
  const daysDiff = moment(endDate).diff(moment(), "days");

  return daysDiff < 0 ? (
    <p className={`text-right text-xs font-semibold text-red-700 `}>
      Ended On {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  ) : (
    <p
      className={`text-right text-xs font-semibold text-gray-600 ${
        daysDiff < 2 ? "text-yellow-600" : ""
      }`}
    >
      Ends On {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  );
};

export default DateInfoCard;

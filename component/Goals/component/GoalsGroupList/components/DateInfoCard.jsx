import moment from "moment";
import React from "react";
import { DATE_FORMAT_FULL } from "../../../../../helpers/dateHelper";
const DateInfoCard = (endDate) => {
  if (!endDate) return null;
  const daysDiff = moment(endDate).diff(moment(), "days");

  console.log({ daysDiff });

  return (
    <p className="text-right text-xs font-semibold text-gray-600">
      Ends On {moment(endDate).format(DATE_FORMAT_FULL)}
    </p>
  );
};

export default DateInfoCard;

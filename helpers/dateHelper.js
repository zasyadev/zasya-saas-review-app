import moment from "moment";
export const MONTH_DATE_FORMAT = "MMM DD, YYYY";
export const MONTH_FORMAT = "MMMM";
export const DATE_FORMAT = "DD";
export const DEFAULT_DATE_FORMAT = "DD-MM-YYYY";
export const DATE_FORMAT_FULL = "DD MMM YYYY";
export const YEAR_DATE_FORMAT = "YYYY-MM-DD";

export function disableDates(current) {
  return current && current > moment().endOf("month");
}

export const disabledPreviousDates = (currentDate) => {
  return currentDate < moment().startOf("day");
};

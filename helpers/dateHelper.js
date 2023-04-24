import moment from "moment";
export const MONTH_DATE_FORMAT = "MMM DD, YYYY";
export const MONTH_FORMAT = "MMMM";
export const SHORT_MONTH_FORMAT = "MMM";
export const DATE_FORMAT = "DD";
export const DEFAULT_DATE_FORMAT = "DD-MM-YYYY";
export const DATE_FORMAT_FULL = "DD MMM YYYY";
export const YEAR_DATE_FORMAT = "YYYY-MM-DD";
export const DEFAULT_DATETIME_FORMAT = "DD-MM-YYYY HH:mm";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm";
export const DAY_NAME = "dddd";
export const TIME_FORMAT = "HH:mm a";

export function disableDates(current) {
  return current && current > moment().endOf("month");
}
export function dateDayName(date) {
  return date && moment(date).format(DAY_NAME);
}
export function dateTime(date) {
  return date && moment(date).format(TIME_FORMAT);
}

export const disabledPreviousDates = (currentDate) => {
  return currentDate < moment().startOf("day");
};

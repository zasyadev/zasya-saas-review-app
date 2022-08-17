import moment from "moment";

export const calculateDuration = ({ from, to }) => {
  let FromDate = moment(from);
  let ToDate = moment(to);
  let numberOfHours = ToDate.diff(FromDate, "hours");
  let numerOfMinutes = ToDate.diff(FromDate, "minutes");
  let days = Math.floor(numberOfHours / 24);
  let Remainder = numberOfHours % 24;
  let hours = Math.floor(Remainder);
  let minutes = Math.floor(numerOfMinutes - 60 * numberOfHours);
  let difference = "";
  if (days > 0) {
    difference += days === 1 ? `${days} d, ` : `${days} ds, `;
  }
  difference += hours === 0 || hours === 1 ? `${hours} h ` : `${hours} h `;
  difference +=
    minutes === 0 || hours === 1 ? `${minutes} min` : `${minutes} min`;
  return difference;
};

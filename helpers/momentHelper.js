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

  return customTimeString({
    days,
    hours,
    minutes,
  });
};

export const calculateMiliDuration = ({ from, to }) => {
  let FromDate = moment(from);
  let ToDate = moment(to);
  let numberOfMiliSecond = ToDate.diff(FromDate);

  return numberOfMiliSecond;
};

export const customTimeString = ({ days, hours, minutes }) => {
  let difference = "";
  if (days > 0) {
    difference += days === 1 ? `${days} d` : `${days} ds`;
  }

  difference += hours ? `${days ? ", " : ""} ${hours} h ` : "";
  difference += minutes ? `${days || hours ? ", " : ""} ${minutes} min` : "";
  return difference;
};

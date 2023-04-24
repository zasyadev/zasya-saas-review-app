import moment from "moment";
import "moment-timezone";

const SUNDAY = "Sunday";
const SATURDAY = "Saturday";

export const calculateDuration = ({ from, to }) => {
  let fromDate = moment(from);
  let toDate = moment(to);
  let numberOfHours = toDate.diff(fromDate, "hours");
  let numerOfMinutes = toDate.diff(fromDate, "minutes");
  let days = Math.floor(numberOfHours / 24);
  let remainder = numberOfHours % 24;
  let hours = Math.floor(remainder);
  let minutes = Math.floor(numerOfMinutes - 60 * numberOfHours);

  return customTimeString({
    days,
    hours,
    minutes,
  });
};

export const calculateMiliDuration = ({ from, to }) => {
  let fromDate = moment(from);
  let toDate = moment(to);
  let numberOfMiliSecond = toDate.diff(fromDate);

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

export const getGoalEndDays = (number) => {
  switch (number) {
    case 0:
      return moment(moment()).add(1, "days").format();
    case 1:
      return moment(moment()).add(7, "days").format();
    case 2:
      return moment(moment()).add(1, "months").format();
    case 3:
      return moment(moment()).add(6, "months").format();

    default:
      return 0;
  }
};

export const halfHourEndTime = (time) =>
  moment(time).add("30", "minutes").format();

export const minutesAddInTime = (time, minutes) =>
  moment(time).add(minutes, "minutes").format();

const randomMinutes = () => {
  const stringsArray = ["0", "20", "40"];
  const randomIndex = Math.floor(Math.random() * stringsArray.length);
  return Number(stringsArray[randomIndex]);
};

const endOfMonthRandomTime = (date) => {
  return date
    .endOf("month")
    .set({ hour: Math.floor(Math.random() * 4) + 14, minute: randomMinutes() });
};

export const getCronNextMeetingDate = (index) => {
  let newDate = moment().tz("Asia/Kolkata");
  // if (Number(index) > -1) {
  //   let counter = 1; // Start with 1
  //   for (let i = 0; i < length; i++) {
  //     if (i % 5 === 0 && i > 0 && i <= index) {
  //       counter++; // Increment counter every 5 elements
  //     }
  //   }
  //   let endMonthDate = endOfMonthRandomTime(newDate);
  //   newDate = endMonthDate.subtract(counter, "days");
  // }

  if (Number(index) > -1) {
    let subtractDays = 1;
    if (index % 2 === 0) {
      subtractDays = Math.floor(Math.random() * 2) + 3;
    } else if (index % 3 === 0 || index % 5 === 0) {
      subtractDays = 2;
    }
    let endMonthDate = endOfMonthRandomTime(newDate);
    newDate = endMonthDate.subtract(subtractDays, "days");
  }

  const weekDayName = newDate.format("dddd");

  if (weekDayName === SUNDAY) return endOfMonthRandomTime(newDate).format();
  else if (weekDayName === SATURDAY)
    return endOfMonthRandomTime(newDate).add(1, "days").format();
  return newDate.format();
};

export const daysDiffrenceInDates = (date) => {
  return moment().diff(date, "days");
};

export const startOfDate = (value) => {
  return moment(value).startOf("day");
};
export const endOfDate = (value) => {
  return moment(value).endOf("day");
};

export const defaultCurrentMonth = {
  lte: moment().endOf("month"),
  gte: moment().startOf("month"),
};

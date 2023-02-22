import moment from "moment";

const SUNDAY = "Sunday";

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

export const afterTodayDates = (date) => {
  let diffrenceInDays = moment().diff(date, "days");

  return moment(date).add(diffrenceInDays + 1, "days");
};

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
  let newDate = moment();

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
  return newDate.format();
};

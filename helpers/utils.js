export const getStatusPillColor = (type) => {
  const statusType = {
    Completed: "text-green-600 bg-green-200",
    OnTrack: "text-blue-600 bg-blue-200",
    Delayed: "text-orange-600 bg-orange-200",
    AtRisk: "text-red-600 bg-red-200",
    Abandoned: "text-gray-500 bg-gray-100",
  };
  return statusType[type] || "";
};

export const getStatusBackground = (type) => {
  const statusType = {
    Completed: "bg-brandGreen-300",
    OnTrack: "bg-brandBlue-300",
    Delayed: "bg-orange-500",
    AtRisk: "bg-red-500",
    Abandoned: "bg-gray-500",
  };
  return statusType[type] || "";
};

export const getGoalFrequency = (number) => {
  const frequencyType = {
    0: "daily",
    1: "weekly",
    2: "monthly",
    3: "halfyearly",
  };
  return frequencyType[number] || "";
};

export function isEmptyStr(str) {
  return !str || !str.trim();
}

export function getRandomBgColor(index) {
  return `hsl(${(index * 9) % 360}, 50%, 50%)`;
}

export function truncateString(str, num) {
  if (!str && !str.trim()) return;
  if (str && str?.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export const getFirstTwoLetter = (text) => {
  if (!text) return "U";
  return text.substring(2, 0);
};
export const getFirstLetter = (text) => {
  if (!text) return "U";
  return text.substring(1, 0);
};

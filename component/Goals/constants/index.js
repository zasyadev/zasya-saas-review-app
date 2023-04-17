export const ORGANIZATION_TYPE = "Organization";
export const SELF_TYPE = "Self";
export const INDIVIDUAL_TYPE = "Individual";
export const TEAM_TYPE = "Team";
export const ONTRACK_STATUS = "OnTrack";
export const COMPLETED_STATUS = "Completed";
export const DELAYED_STATUS = "Delayed";
export const ABANDONED_STATUS = "Abandoned";
export const ATRISK_STATUS = "AtRisk";
export const GRID_DISPLAY = "grid";
export const LIST_DISPLAY = "list";

export const GROUP_ITEMS = [
  {
    title: "Daily",
    type: "daily",
  },
  {
    title: "Weekly",
    type: "weekly",
  },
  {
    title: "Monthly",
    type: "monthly",
  },
  {
    title: "Half Yearly",
    type: "halfyearly",
  },
];
export const GOALS_FILTER_LIST = [
  { value: "All", label: "All" },
  { value: "OnTrack", label: "On Track" },
  { value: "Completed", label: "Completed" },
  { value: "Delayed", label: "Delayed" },
  { value: "Abandoned", label: "Abandoned" },
  { value: "Archived", label: "Archived" },
];

export const statusPill = (type) => {
  const statusType = {
    Completed: "text-green-600 bg-green-200",
    OnTrack: "text-blue-600 bg-blue-200",
    Delayed: "text-orange-600 bg-orange-200",
    AtRisk: "text-red-600 bg-red-200",
    Abandoned: "text-gray-500 bg-gray-100",
  };
  return statusType[type] || "";
};

export const statusBackground = (type) => {
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

export const GOALS_FILTER_STATUS = {
  ALL: "All",
  ARCHIVED: "Archived",
};

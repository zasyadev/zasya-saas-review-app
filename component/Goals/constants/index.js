export const ORGANIZATION_TYPE = "Organization";
export const SELF_TYPE = "Self";
export const INDIVIDUAL_TYPE = "Individual";
export const TEAM_TYPE = "Team";

export const ONTRACK_STATUS = "OnTrack";
export const COMPLETED_STATUS = "Completed";
export const DELAYED_STATUS = "Delayed";
export const ABANDONED_STATUS = "Abandoned";
export const ATRISK_STATUS = "AtRisk";

export const groupItems = [
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
export const goalsFilterList = [
  { value: "All", label: "All" },
  { value: "OnTrack", label: "On Track" },
  { value: "Completed", label: "Completed" },
  { value: "Delayed", label: "Delayed" },
  { value: "AtRisk", label: "At Risk" },
  { value: "Abandoned", label: "Abandoned" },
  { value: "Archived", label: "Archived" },
];

export const statusPill = (key) => {
  switch (key) {
    case "Completed":
      return "text-green-600 bg-green-200";
    case "OnTrack":
      return "text-blue-600 bg-blue-200";
    case "Delayed":
      return "text-orange-600 bg-orange-200";
    case "AtRisk":
      return "text-red-600 bg-red-200";
    case "Abandoned":
      return "text-gray-500 bg-gray-100";
    default:
      return "";
  }
};

export const getGoalFrequency = (number) => {
  switch (number) {
    case 0:
      return "daily";
    case 1:
      return "weekly";
    case 2:
      return "monthly";
    case 3:
      return "halfyearly";
    default:
      return 0;
  }
};

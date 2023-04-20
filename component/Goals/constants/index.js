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

export const GOALS_FILTER_STATUS = {
  ALL: "All",
  ARCHIVED: "Archived",
};

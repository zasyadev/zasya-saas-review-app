export const SUPERADMIN_ROLE = 1;
export const ADMIN_ROLE = 2;
export const MANAGER_ROLE = 3;
export const MEMBER_ROLE = 4;

export const INITIAL_CRON_TYPES = {
  APPLAUD: "APPLAUD",
  REVIEW: "REVIEW",
};

export const USER_STATUS_TYPE = {
  ACTIVE: 1,
  INACTIVE: 0,
};

export const ACTIVITY_TYPE_ENUM = {
  REVIEW: "Review",
  GOAL: "Goal",
  APPLAUD: "Applaud",
  FOLLOWUP: "FollowUp",
  SURVEY: "Survey",
  REVIEWANSWER: "ReviewAnswer",
  APPLAUDGIVEN: "ApplaudGiven",
  GOALGIVEN: "GoalGiven",
  FOLLOWUPGIVEN: "FollowUpGiven",
  REVIEWGIVEN: "ReviewGiven",
};

export const USER_SELECT_FEILDS = {
  select: {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
    status: true,
    role_id: true,
    organization_id: true,
    createdDate: true,
    modified_date: true,
  },
};

export const activityTitle = (key, name) => {
  switch (key) {
    case ACTIVITY_TYPE_ENUM.APPLAUD:
      return `${name ?? ""} has applauded you`;
    case ACTIVITY_TYPE_ENUM.APPLAUDGIVEN:
      return ` You have applauded ${name ?? ""}`;
    case ACTIVITY_TYPE_ENUM.GOAL:
      return `${name ?? ""} has assigned you a goal`;
    case ACTIVITY_TYPE_ENUM.GOALGIVEN:
      return ` You have assigned a goal to ${name ?? ""}`;
    case ACTIVITY_TYPE_ENUM.REVIEW:
      return `${name ?? ""} has assigned you a review`;
    case ACTIVITY_TYPE_ENUM.REVIEWGIVEN:
      return ` You have assigned a review to ${name ?? ""}`;
    case ACTIVITY_TYPE_ENUM.FOLLOWUP:
      return `${name ?? ""} has scheduled a meeting with you`;
    case ACTIVITY_TYPE_ENUM.FOLLOWUPGIVEN:
      return ` You have scheduled a meeting with ${name ?? ""}`;
    default:
      return "";
  }
};

export const DATA_NOT_FOUND_MSG = "List Not Found";

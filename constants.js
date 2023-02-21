export const SUPERADMIN_ROLE = 1;
export const ADMIN_ROLE = 2;
export const MANAGER_ROLE = 3;
export const MEMBER_ROLE = 4;

export const INITIAL_CRON_TYPES = {
  APPLAUD: "APPLAUD",
  REVIEW: "REVIEW",
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

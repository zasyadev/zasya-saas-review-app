import * as yup from "yup";

const CREATE_MEETING_SCHEMA = yup.object().shape({
  meeting_title: yup.string().max(180).required().label("Meeting Title"),
  meeting_description: yup.string().max(500).label("Meeting Description"),
  meeting_type: yup.string().required().label("Meeting Type"),
  meeting_at: yup.date().required().label("Meeting Date"),
});

const UPDATE_MEETING_SCHEMA = yup.object().shape({
  id: yup.string().required().label("Meeting Id"),
  meeting_title: yup.string().max(180).required().label("Meeting Title"),
  meeting_description: yup.string().max(500).label("Meeting Description"),
  meeting_at: yup.date().required().label("Meeting Date"),
});
const CREATE_MEETING_ASSIGNEE_SCHEMA = yup.object().shape({
  assigneeId: yup.string().required().label("Assignee Id"),
  comment: yup.string().label("Meeting Comment"),
});

const UPDATE_MEETING_IS_COMPELTE_SCHEMA = yup.object().shape({
  isCompleted: yup.bool().label("Meeting Status"),
});

export const MEETING_SCHEMA = {
  POST: CREATE_MEETING_SCHEMA,
  PUT: UPDATE_MEETING_SCHEMA,
};
export const MEETING_ASSIGNEE_SCHEMA = {
  POST: CREATE_MEETING_ASSIGNEE_SCHEMA,
  PUT: UPDATE_MEETING_IS_COMPELTE_SCHEMA,
};

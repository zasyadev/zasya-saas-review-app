import * as yup from "yup";

const CREATE_GOALS_SCHEMA = yup.object().shape({
  goals_headers: yup.array().required().label("Goal Headers"),
  goal_type: yup.string().label("Goal Type"),
  status: yup.string().required().label("Goal Status"),
  end_date: yup.date().required().label("End Date"),
});

const UPDATE_GOALS_SCHEMA = yup.object().shape({
  id: yup.string().required().label("Goal Id"),
  goals_headers: yup.array().required().label("Goal Headers"),
  goal_type: yup.string().label("Goal Type"),
  status: yup.string().required().label("Goal Status"),
});

export const GOALS_SCHEMA = {
  POST: CREATE_GOALS_SCHEMA,
  PUT: UPDATE_GOALS_SCHEMA,
};

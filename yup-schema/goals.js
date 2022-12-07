import * as yup from "yup";

const CREATE_GOALS_SCHEMA = yup.object().shape({
  goal_title: yup.string().required().label("Goal Title"),
  goal_description: yup.string().required().label("Goal Description"),
  goal_type: yup.string().label("Goal Type"),
  status: yup.string().required().label("Goal Status"),
  end_date: yup.date().required().label("End Date"),
});

const UPDATE_GOALS_SCHEMA = yup.object().shape({
  id: yup.string().required().label("Goal Id"),
  goal_title: yup.string().required().label("Goal Title"),
  goal_description: yup.string().required().label("Goal Description"),
  goal_type: yup.string().label("Goal Type"),
  status: yup.string().required().label("Goal Status"),
  end_date: yup.date().required().label("End Date"),
});

export const GOALS_SCHEMA = {
  POST: CREATE_GOALS_SCHEMA,
  PUT: UPDATE_GOALS_SCHEMA,
};

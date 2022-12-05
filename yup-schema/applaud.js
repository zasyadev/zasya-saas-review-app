import * as yup from "yup";

const CREATE_APPLAUD_SCHEMA = yup.object().shape({
  user_id: yup.string().required().label("User ID"),
  comment: yup.string().required().label("Applaud Comment"),
  category: yup.array().required().label("Category"),
});

export const APPLAUD_SCHEMA = {
  POST: CREATE_APPLAUD_SCHEMA,
};

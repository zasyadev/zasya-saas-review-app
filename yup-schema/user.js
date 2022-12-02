import * as yup from "yup";

export const CREATE_USER_SCHEMA = yup.object().shape({
  first_name: yup.string().max(50).required().label("Name"),
  company_name: yup.string().max(100).required().label("Company Name"),
  email: yup.string().max(62).email().required().label("Email"),
  password: yup.string().min(6).required().label("Password"),
});

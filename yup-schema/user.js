import * as yup from "yup";

const CREATE_USER_SCHEMA = yup.object().shape({
  first_name: yup.string().max(50).required().label("Name"),
  company_name: yup.string().max(100).required().label("Company Name"),
  email: yup.string().max(62).email().required().label("Email"),
  password: yup.string().min(6).required().label("Password"),
});

const UPDATE_USER_SCHEMA = yup.object().shape({
  first_name: yup.string().max(50).required().label("Name"),
  about: yup.string().max(400).required().label("About"),
  address1: yup.string().max(200).required().label("Address 1"),
  address2: yup.string().max(200).label("Address 2"),
  mobile: yup.string().max(20).required().label("Phone Number"),
  notification: yup
    .array()
    .of(yup.string())
    .required()
    .label("Notification Method"),
  imageName: yup.string().optional().nullable().label("Image"),
});

const UPDATE_USER_PASSWORD_SCHEMA = yup.object().shape({
  old_password: yup.string().required().label("Old Password"),
  new_password: yup.string().min(6).required().label("New Password"),
});

export const USER_SCHEMA = {
  POST: CREATE_USER_SCHEMA,
};

export const UPDATE_PROFILE_SCHEMA = {
  POST: UPDATE_USER_SCHEMA,
};

export const USER_PASSWORD_SCHEMA = {
  POST: UPDATE_USER_PASSWORD_SCHEMA,
};

const CREATE_MEMBER_SCHEMA = yup.object().shape({
  first_name: yup.string().max(50).required().label("Name"),
  created_by: yup.string().required().label("Created By"),
  email: yup.string().max(62).email().required().label("Email"),
  tags: yup.array().of(yup.string()).required().label("Tags"),
  role: yup.number().required().label("Role"),
});

const UPDATE_MEMBER_SCHEMA = yup.object().shape({
  id: yup.string().required().label("Member Id"),
  first_name: yup.string().max(50).required().label("Name"),
  created_by: yup.string().required().label("Created By"),
  tags: yup.array().of(yup.string()).required().label("Tags"),
  role: yup.number().required().label("Role"),
});

export const MEMBER_SCHEMA = {
  POST: CREATE_MEMBER_SCHEMA,
  PUT: UPDATE_MEMBER_SCHEMA,
};

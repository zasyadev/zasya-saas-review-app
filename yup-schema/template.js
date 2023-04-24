import * as yup from "yup";

const CREATE_TEMPLATE_SCHEMA = yup.object().shape({
  default_template: yup.boolean().required().label("Default Template"),
  form_data: yup.object().required().label("Template Title"),
  form_description: yup.string().label("Template Description"),
  form_title: yup.string().required().label("Template Title"),
  status: yup.boolean().required().label("Template Status"),
});

const UPDATE_TEMPLATE_SCHEMA = yup.object().shape({
  id: yup.string().required().label("Template Id"),
  default_template: yup.boolean().required().label("Default Template"),
  form_data: yup.object().required().label("Template Title"),
  form_description: yup.string().label("Template Description"),
  form_title: yup.string().required().label("Template Title"),
  status: yup.boolean().required().label("Template Status"),
});

export const TEMPLATE_SCHEMA = {
  POST: CREATE_TEMPLATE_SCHEMA,
  PUT: UPDATE_TEMPLATE_SCHEMA,
};

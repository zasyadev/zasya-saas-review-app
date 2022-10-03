import { Input, Checkbox } from "antd";
import React from "react";

export function CustomInput(props) {
  return (
    <Input
      className={`focus:border-primary hover:border-primary shadow hover:shadow-primary  focus:shadow-primary h-12 rounded-md placeholder-gray-500  ${props.customclassname}`}
      {...props}
    />
  );
}
export function CustomTextArea(props) {
  return (
    <Input.TextArea
      className={`focus:border-primary hover:border-primary shadow hover:shadow-primary  focus:shadow-primary  rounded-md placeholder-gray-500  ${props.customclassname}`}
      {...props}
    />
  );
}
export function CustomCheckbox({ title, ...props }) {
  return <Checkbox {...props}>{title}</Checkbox>;
}

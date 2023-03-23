import { Input, Checkbox } from "antd";
import React from "react";

export function CustomInput(props) {
  return (
    <Input
      className={`focus:border-primary-green text-base font-medium hover:border-primary-green shadow hover:shadow-primary-green  focus:shadow-primary-green h-12 rounded-md placeholder-gray-500  ${props.customclassname}`}
      {...props}
    />
  );
}
export function CustomTextArea(props) {
  return (
    <Input.TextArea
      className={`focus:border-primary-green text-base font-medium hover:border-primary-green shadow hover:shadow-primary-green  focus:shadow-primary-green  rounded-md placeholder-gray-500  ${props.customclassname}`}
      {...props}
    />
  );
}
export function CustomCheckbox({ title, ...props }) {
  return (
    <Checkbox className="font-medium" {...props}>
      {title}
    </Checkbox>
  );
}

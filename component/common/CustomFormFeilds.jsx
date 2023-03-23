import { Input, Checkbox } from "antd";
import clsx from "clsx";
import React from "react";

export function CustomInput(props) {
  return (
    <Input
      className={clsx(
        "focus:border-primary-green text-base font-medium",
        "hover:border-primary-green  hover:shadow-primary-green  focus:shadow-primary-green",
        "h-12 rounded-md placeholder-gray-500 shadow",
        props.customclassname
      )}
      {...props}
    />
  );
}
export function CustomTextArea(props) {
  return (
    <Input.TextArea
      className={clsx(
        "focus:border-primary-green text-base font-medium hover:border-primary-green",
        "shadow hover:shadow-primary-green  focus:shadow-primary-green  rounded-md placeholder-gray-500",

        props.customclassname
      )}
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

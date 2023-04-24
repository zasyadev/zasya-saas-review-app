import { Input, Checkbox } from "antd";
import clsx from "clsx";
import React from "react";

export function CustomInput(props) {
  return (
    <Input
      className={clsx(
        "focus:border-gray-500 text-base font-medium border",
        "hover:border-gray-500 outline-0  shadow-sm",
        "h-12 rounded-md placeholder-gray-500 ",
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
        "focus:border-gray-500 text-base font-medium hover:border-gray-500",
        "shadow-sm rounded-md placeholder-gray-500",

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

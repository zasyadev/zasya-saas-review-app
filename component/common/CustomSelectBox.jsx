import { Select } from "antd";
import React from "react";

export default function CustomSelectBox({
  arrayList,
  handleOnChange,
  value,
  className,
  valueInLabel = false,
  ...rest
}) {
  return (
    <Select
      value={value}
      size="large"
      onChange={(value) => handleOnChange(value)}
      className={` ${className}`}
      {...rest}
    >
      {arrayList.map((item, idx) => (
        <Select.Option
          value={valueInLabel ? item.label : item.value}
          key={valueInLabel ? item.label : item.value + idx}
          className="font-medium"
        >
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}

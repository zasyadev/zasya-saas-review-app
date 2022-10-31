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
      className={`question-select-box ${className}`}
      {...rest}
    >
      {arrayList.map((item, idx) => (
        <Select.Option
          value={valueInLabel ? item.label : item.value}
          key={value + idx}
        >
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}

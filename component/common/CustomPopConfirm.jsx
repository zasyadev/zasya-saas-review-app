import { Popconfirm } from "antd";
import React from "react";

export default function CustomPopConfirm({
  title = "Are you sure?",
  onConfirm = () => {},
  className,
  label,
  ...rest
}) {
  return (
    <Popconfirm
      title={title}
      okText="Yes"
      cancelText="No"
      onConfirm={onConfirm}
      icon={false}
      className={className}
      {...rest}
    >
      {label}
    </Popconfirm>
  );
}

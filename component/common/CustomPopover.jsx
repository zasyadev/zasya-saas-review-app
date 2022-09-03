import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";

function CustomPopover(text) {
  return (
    <Popover content={text} trigger="click" placement="bottom">
      <InfoCircleOutlined />
    </Popover>
  );
}

export default CustomPopover;

import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React from "react";

function CustomPopover(text) {
  return (
    <Popover content={text} trigger="click" placement="bottom">
      <InfoCircleOutlined />
    </Popover>
  );
}

export default CustomPopover;

import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React from "react";

function CustomPopover(text) {
  return (
    <Popover
      content={<p className="font-medium mb-0">{text}</p>}
      trigger={["click", "hover"]}
      placement="top"
      overlayClassName="max-w-sm"
    >
      <InfoCircleOutlined />
    </Popover>
  );
}

export default CustomPopover;

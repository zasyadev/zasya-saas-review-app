import { Table } from "antd";
import React from "react";

const CustomTable = ({
  className = "",
  rowClassName,

  ...props
}) => {
  return (
    <div className="overflow-auto">
      <Table
        bordered={false}
        className={`rounded-md bg-white custom-table ${className}`}
        {...props}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "" : "background-color-voilet"
        }
      />
    </div>
  );
};

export default CustomTable;

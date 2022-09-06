import { Table } from "antd";
import React from "react";

const CustomTable = ({
  columns,
  className = "",
  dataSource,
  rowClassName,
  ...props
}) => {
  return (
    <Table
      bordered={false}
      className={"rounded-md bg-white custom-table"}
      {...props}
      columns={columns}
      dataSource={dataSource}
      rowClassName={(_, index) =>
        index % 2 === 0 ? "" : "background-color-voilet"
      }
    />
  );
};

export default CustomTable;

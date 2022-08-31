import React from "react";
import { Table } from "antd";

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
      className={"rounded-lg bg-white custom-table"}
      {...props}
      columns={columns}
      dataSource={dataSource}
      // rowKey={(record, index) => (record?.id ? record.id : index)}
      rowClassName={(_, index) =>
        index % 2 === 0 ? "" : "background-color-voilet"
      }
    />
  );
};

export default CustomTable;

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
      rowKey={(record) => record.contact_group_id}
      rowClassName={(record, index) => (index % 2 === 0 ? "" : "voilet")}
      pagination={false}
    />
  );
};

export default CustomTable;

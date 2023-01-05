import { Table } from "antd";
import React from "react";

const CustomTable = ({
  className = "",
  rowKeyLabel = "id",
  isPagination = true,
  ...props
}) => {
  return (
    <div className="overflow-auto rounded-md">
      <Table
        bordered={false}
        className={`rounded-md bg-white custom-table ${className}`}
        {...props}
        rowClassName={(_, index) =>
          index % 2 === 0 ? "" : "background-color-voilet"
        }
        rowKey={(record) => record[rowKeyLabel]}
        pagination={
          isPagination
            ? {
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "50", "100", "200"],
                className: "px-2 sm:px-4",
              }
            : false
        }
      />
    </div>
  );
};

export default CustomTable;

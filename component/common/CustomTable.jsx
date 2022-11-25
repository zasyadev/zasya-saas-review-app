import { Table } from "antd";
import React from "react";

const CustomTable = ({ className = "", rowKeyLabel = "id", ...props }) => {
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
      />
    </div>
  );
};

export default CustomTable;

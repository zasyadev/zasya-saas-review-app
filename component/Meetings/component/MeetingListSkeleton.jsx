import React from "react";
import { Skeleton } from "antd";

const GoalsGroupListSkeleton = ({ title = "" }) => {
  return (
    <div className=" bg-white rounded-md pb-3">
      <div className=" items-center p-4 font-bold text-lg capitalize">
        <p className="mb-2">{title}</p>
      </div>
      <div className="divide-y space-y-3 max-h-screen overflow-y-auto custom-scrollbar px-2">
        {[...Array(3)].map((_, index) => (
          <div
            className="py-4 bg-gray-50 border border-gray-100 shadow-sm rounded-md "
            key={index + "skkey"}
          >
            <div className=" px-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>

              <div className="flex justify-between ">
                <Skeleton title={false} active paragraph={{ rows: 0 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsGroupListSkeleton;

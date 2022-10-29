import React from "react";

export default function NoRecordFound({ title = "No Record Found" }) {
  return (
    <div className=" flex bg-white items-center justify-center rounded-md  p-5 h-20 ">
      <p className="text-gray-600 text-center text-sm font-medium  mb-0">
        {title}
      </p>
    </div>
  );
}

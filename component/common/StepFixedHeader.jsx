import React from "react";
import { useRouter } from "next/router";
import { CloseOutlined } from "@ant-design/icons";

const StepFixedHeader = ({ title }) => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3.5 md:px-6 md:py-4 z-10">
      <div className="flex justify-between items-center">
        <p className="text-lg  font-semibold mb-0">{title} </p>
        <div
          className=" rounded-full leading-0 cursor-pointer bg-primary-green w-7 h-7 grid place-content-center text-white"
          onClick={() => router.back()}
        >
          <CloseOutlined className="text-base" />
        </div>
      </div>
    </div>
  );
};

export default StepFixedHeader;

import React from "react";
import { useRouter } from "next/router";
import { CloseOutlined } from "@ant-design/icons";

const StepFixedHeader = ({ title }) => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 bg-white px-6 py-4 rounded-md z-10">
      <div className="flex justify-between items-center">
        <p className="text-lg text-primary font-semibold mb-0">{title} </p>
        <div
          className=" rounded-full leading-0 cursor-pointer hover:text-red-400"
          onClick={() => router.back()}
        >
          <CloseOutlined className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default StepFixedHeader;

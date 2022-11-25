import { Skeleton } from "antd";
import React from "react";

const EditiorTitlePageLoader = () => {
  return (
    <div className="px-4 md:px-6 pb-28 pt-20 md:pt-20 md:pb-24  bg-gray-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-white px-6 py-4 rounded-md z-10">
        <div className="flex justify-between items-center">
          <Skeleton.Input className="mb-0" active />
          <Skeleton.Button active />
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-white p-2 md:px-5 md:pt-5 md:pb-6 xl:p-8 xl:pt-6 rounded-md mx-auto space-y-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <div className=" bg-white p-3 md:p-5 rounded-md w-full">
          <div className="flex justify-between  items-center">
            <Skeleton.Input className="mb-0" active />
            <Skeleton.Input className="hidden md:block mb-0" active />
            <Skeleton.Button active />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditiorTitlePageLoader;

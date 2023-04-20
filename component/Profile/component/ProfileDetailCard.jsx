import React from "react";

export function ProfileDetailCard({
  count,
  title,
  Icon,
  className = "",
  iconClassName = "",
}) {
  return (
    <div
      className={`px-4 xl:px-5 py-3 rounded-t-md transition-all duration-300 ease-in   ${className}`}
    >
      <div className="flex flex-wrap items-center  h-full gap-3 select-none">
        <div
          className={`grid items-center w-10 h-10 py-1 px-1 justify-center shadow-md rounded-full ${iconClassName}`}
        >
          <Icon />
        </div>
        <div className="flex-1">
          <span className="text-xl xl:text-2xl font-bold ">{count}</span>
          <div className="flex items-start text-gray-500 justify-between font-medium tracking-wide text-sm xl:text-base mb-1">
            <span className="flex-1">{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

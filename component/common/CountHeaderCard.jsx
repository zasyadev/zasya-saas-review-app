import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function CountHeaderCard({
  imgSrc,
  imgSrcClassNames,
  title,
  subTitle,
  onClick = () => {},
  className = "",
}) {
  return (
    <div
      className={twMerge(
        clsx("bg-white rounded-md shadow-md flex space-x-4 p-4", className)
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          "grid place-content-center w-12 h-12 rounded-full",
          imgSrcClassNames
        )}
      >
        <img src={imgSrc} alt={title} className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-lg font-medium mb-0 capitalize">{title}</p>
        <p className="text-base font-medium text-gray-400 mb-0">{subTitle}</p>
      </div>
    </div>
  );
}

export default CountHeaderCard;

import React from "react";

function CountHeaderCard({ imgSrc, imgSrcClassNames, title, subTitle }) {
  return (
    <div className="bg-white rounded-md shadow-md flex space-x-4 p-4">
      <div
        className={`grid place-content-center w-12 h-12 rounded-full ${imgSrcClassNames}`}
      >
        <img src={imgSrc} alt={title} className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-lg font-medium ">{title}</p>
        <p className="text-base font-medium text-gray-400">{subTitle}</p>
      </div>
    </div>
  );
}

export default CountHeaderCard;

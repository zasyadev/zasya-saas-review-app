import React from "react";
import CustomSelectBox from "./CustomSelectBox";

export default function ToggleButton({ arrayList, activeKey, handleToggle }) {
  return (
    <>
      <div className="md:flex hidden">
        {arrayList.map((item, idx) => (
          <button
            className={` w-1/2  md:w-fit rounded-md text-center px-4 py-2 border font-medium ${
              activeKey === item.label
                ? "bg-primary text-white"
                : "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600"
            }
        ${
          idx === 0
            ? "rounded-r-none rounded-l-md"
            : "rounded-l-none border-l-0 rounded-r-md"
        }
        `}
            onClick={() => handleToggle(item.label)}
            key={item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      <CustomSelectBox
        className={"block md:hidden w-36 text-sm question-select-box"}
        arrayList={arrayList}
        valueInLabel
        value={activeKey}
        handleOnChange={(selectedKey) => handleToggle(selectedKey)}
      />
    </>
  );
}

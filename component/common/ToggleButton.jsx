import React from "react";
import CustomSelectBox from "./CustomSelectBox";

export default function ToggleButton({ arrayList, activeKey, handleToggle }) {
  return (
    <CustomSelectBox
      className={"block  w-36 text-sm question-select-box"}
      arrayList={arrayList}
      valueInLabel
      value={activeKey}
      handleOnChange={(selectedKey) => handleToggle(selectedKey)}
    />
  );
}

import { Input, Rate, Select } from "antd";
import Image from "next/image";
import React from "react";
import { PrimaryButton } from "../../common/CustomButton";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";

export function MultipleChoiceType({
  idx,
  options,
  handleOptionValue,
  removeOption,
  addOption,
}) {
  return (
    <>
      <p className="font-medium text-base">Multiple choice</p>
      {options.map((op, j) => (
        <div key={"Multiple choice" + j}>
          <div className="flex flex-row  items-center">
            <Input
              placeholder={`E.g. Option ${j + 1}`}
              className="question-border h-12 rounded-md placeholder-gray-500 w-40 xl:w-64 "
              onChange={(e) => {
                handleOptionValue(e.target.value, idx, j);
              }}
              value={op.optionText}
              maxLength={180}
            />
            {j !== 0 && (
              <button
                onClick={() => {
                  removeOption(idx, j);
                }}
                className="p-2 bg-gray-100 ml-4 rounded-full leading-0"
              >
                <Image
                  src={"/media/svg/close-line.svg"}
                  alt="Close "
                  width={20}
                  height={20}
                />
              </button>
            )}
          </div>
          {op?.error && (
            <p className="text-red-600 text-sm my-2">{op?.error}</p>
          )}
        </div>
      ))}
      {options.length < 5 ? (
        <PrimaryButton
          onClick={() => {
            addOption(idx);
          }}
          className=" rounded-md w-1/2 md:w-fit mt-2"
          title={"Add a choice"}
        />
      ) : (
        ""
      )}
    </>
  );
}

export function InputType({ type }) {
  return (
    <div className="mt-3">
      <p className="text-slate-400 text-base border-b border-slate-400">
        {type === "input" ? "Short Text" : "Long Text"}
      </p>
    </div>
  );
}
export function YesNoType() {
  return (
    <>
      <p className="font-medium text-base mb-0 text-center">
        Agree or Disagree
      </p>
      <div className="flex items-center justify-center mt-3">
        <div className="p-5 md:p-8  border mx-2 rounded-sm">
          <LikeOutlined style={{ fontSize: "64px" }} />
        </div>
        <div className="p-5 md:p-8 border mx-2 rounded-sm">
          <DislikeOutlined style={{ fontSize: "64px" }} />
        </div>
      </div>
    </>
  );
}
export function RatingType() {
  return (
    <div>
      <p className="font-medium text-base mb-0 text-center">Rating</p>
      <div className="question-rating">
        <Rate disabled />
      </div>
    </div>
  );
}
export function OpinionScaleType({
  idx,
  handleScaleOptionValue,
  options,
  handleOptionValue,
  lowerLabel,
  higherLabel,
}) {
  return (
    <>
      <p className="font-medium text-base mb-2">Opinion Scale</p>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="space-y-3">
          <div className="flex items-center">
            <Select
              value={lowerLabel ?? 0}
              onChange={(e) => {
                handleScaleOptionValue(e, idx, "lowerLabel");
              }}
              className="rounded-md placeholder-gray-500"
            >
              <Select.Option value={0}>0</Select.Option>
              <Select.Option value={1}>1</Select.Option>
            </Select>{" "}
            <p className="ml-4 font-medium mb-0">label </p>
          </div>
          {options.length > 1 && (
            <>
              <Input
                placeholder="E.g. Low"
                className="question-border text-base mt-2 h-10 rounded-md placeholder-gray-500"
                onChange={(e) => {
                  handleOptionValue(e.target.value, idx, 0);
                }}
                value={options[0].optionText}
                maxLength={180}
              />
              {options[0]?.error && (
                <p className="text-red-600 text-sm my-2">{options[0]?.error}</p>
              )}
            </>
          )}
        </div>

        <p className="mb-0">To </p>

        <div className="space-y-3">
          <div className="flex items-center">
            <Select
              value={higherLabel ?? 5}
              onChange={(e) => {
                handleScaleOptionValue(e, idx, "highLabel");
              }}
              className="rounded-md placeholder-font-medium placeholder-gray-500"
            >
              <Select.Option value={5}>5</Select.Option>
              <Select.Option value={10}>10</Select.Option>
            </Select>
            <p className="ml-4 font-medium mb-0">label </p>
          </div>
          {options.length > 1 && (
            <>
              <Input
                placeholder="E.g. High"
                className="question-border text-base h-10 mt-2 rounded-md placeholder-gray-500"
                onChange={(e) => {
                  handleOptionValue(e.target.value, idx, 1);
                }}
                value={options[1].optionText}
                maxLength={180}
              />
              {options[1]?.error && (
                <p className="text-red-600 text-sm my-2">{options[1]?.error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function QuestionTypeCard({
  idx,
  title,
  Icon,
  type,
  defineType,
  setSelectTypeFeild,
}) {
  return (
    <div
      className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 lg:px-5 py-4 rounded-md cursor-pointer space-x-3 shadow-sm"
      onClick={(e) => {
        defineType(type, idx);
        setSelectTypeFeild(false);
      }}
    >
      <Icon />

      <p className="mb-0 text-base font-semibold text-primary">{title}</p>
    </div>
  );
}

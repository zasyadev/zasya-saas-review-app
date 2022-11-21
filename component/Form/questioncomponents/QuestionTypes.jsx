import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { Rate, Select } from "antd";
import Image from "next/image";
import React from "react";
import { ButtonGray } from "../../common/CustomButton";
import { CustomInput } from "../../common/CustomFormFeilds";
import ErrorBox from "../../common/ErrorBox";

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {options.map((op, j) => (
          <div key={"Multiple choice" + j}>
            <div className="flex flex-row  items-center">
              <CustomInput
                placeholder={`E.g. Option ${j + 1}`}
                customclassname="w-60 xl:w-64 flex-1"
                onChange={(e) => {
                  handleOptionValue(e.target.value, idx, j);
                }}
                value={op.optionText}
                maxLength={180}
              />
              {j !== 0 ? (
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
              ) : (
                <div className="opacity-0 w-8 h-8 ml-4"></div>
              )}
            </div>

            <ErrorBox error={op?.error} />
          </div>
        ))}
      </div>
      {options.length < 5 && (
        <ButtonGray
          onClick={() => {
            addOption(idx);
          }}
          className="shadow-sm"
          title={"Add a choice"}
        />
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
          <LikeOutlined className="text-4xl sm:text-6xl" />
        </div>
        <div className="p-5 md:p-8 border mx-2 rounded-sm">
          <DislikeOutlined className="text-4xl sm:text-6xl" />
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
      <div className="flex flex-col gap-4 items-start lg:flex-row lg:gap-8 lg:items-center ">
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
            </Select>
            <p className="ml-4 font-medium mb-0">label </p>
          </div>
          {options.length > 1 && (
            <>
              <CustomInput
                placeholder="E.g. Low"
                customclassname="w-60 xl:w-64"
                onChange={(e) => {
                  handleOptionValue(e.target.value, idx, 0);
                }}
                value={options[0].optionText}
                maxLength={180}
              />

              <ErrorBox error={options[0]?.error} />
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
              <CustomInput
                placeholder="E.g. High"
                customclassname="w-60 xl:w-64"
                onChange={(e) => {
                  handleOptionValue(e.target.value, idx, 1);
                }}
                value={options[1].optionText}
                maxLength={180}
              />

              <ErrorBox error={options[1]?.error} />
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
      className="flex items-center border gap-2 md:gap-4 border-gray-200 bg-white hover:bg-gray-100  rounded-md cursor-pointer shadow-sm overflow-hidden"
      onClick={(e) => {
        defineType(type, idx);
        setSelectTypeFeild(false);
      }}
    >
      <div className="grid place-content-center overflow-hidden border-r border-gray-200 bg-gray-50 w-14 h-14 2xl:w-16 2xl:h-16">
        <Icon />
      </div>

      <div className="flex-1">
        <p className="mb-0 text-sm 2xl:text-base font-semibold text-primary">
          {title}
        </p>
      </div>
    </div>
  );
}

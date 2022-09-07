import { Col, Input, Radio, Rate, Row, Select } from "antd";
import Image from "next/image";
import React from "react";

import { DislikeOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import {
  CheckboxIcon,
  DislikeIcon,
  LikeIcon,
  ScaleIcon,
  TextIcon,
} from "../../assets/icons";
import { PrimaryButton } from "../common/CustomButton";

const QuestionTypeList = [
  {
    title: "Text",
    Icon: () => <TextIcon />,
    type: "input",
  },
  {
    title: "Paragraph",
    Icon: () => <TextIcon />,
    type: "textarea",
  },

  {
    title: "Multiple Choice",
    Icon: () => <CheckboxIcon />,
    type: "checkbox",
  },

  {
    title: "Opinion Scale",
    Icon: () => <ScaleIcon />,
    type: "scale",
  },
  {
    title: "Yes or No",
    Icon: () => (
      <div className=" mr-3">
        <p className="mb-0">
          <LikeIcon />
        </p>
        <p className="mt-1 mb-0">
          <DislikeIcon />
        </p>
      </div>
    ),
    type: "yesno",
  },

  {
    title: "Rating",
    Icon: () => <StarOutlined />,
    type: "rating",
  },
];

const QuestionTypeCard = ({
  idx,
  title,
  Icon,
  type,
  defineType,
  setSelectTypeFeild,
}) => (
  <div
    className="flex items-center bg-gray-100 hover:bg-gray-200 px-6 py-4 rounded-md cursor-pointer space-x-3 shadow-sm"
    onClick={(e) => {
      defineType(type, idx);
      setSelectTypeFeild(false);
    }}
  >
    <Icon />

    <p className="mb-0 text-base font-semibold text-primary">{title}</p>
  </div>
);

const QuestionComponent = ({
  type,
  idx,
  removeElement,
  defineType,
  questionText,
  options,
  open,
  error = "",
  showAsQuestion,
  handleExpand,
  addOption,
  handleQuestionValue,
  handleOptionValue,
  removeOption,
  lowerLabel,
  higherLabel,
  handleScaleOptionValue,
  addNextQuestionField,
  selectTypeFeild,
  setSelectTypeFeild,
}) => {
  const range = (min, max) =>
    [...Array(max - min + 1).keys()].map((i) => i + min);

  return selectTypeFeild ? (
    <div className="py-4 ">
      <div className=" py-3 px-5 border-b border-b-e3e3e3">
        <p className="text-lg font-semibold">Choose Question Type</p>
      </div>
      <div className="my-4 mx-6">
        <Row gutter={[16, 16]}>
          {QuestionTypeList.map((quesType) => (
            <Col md={8} xs={12} key={quesType.title}>
              <QuestionTypeCard
                idx={idx}
                title={quesType.title}
                Icon={quesType.Icon}
                type={quesType.type}
                defineType={defineType}
                setSelectTypeFeild={setSelectTypeFeild}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  ) : (
    <>
      <div className="flex items-center justify-center question-edit-view">
        <span
          className={`mx-2 ${open ? "active-tab" : null}`}
          onClick={() => handleExpand(idx)}
        >
          Edit{" "}
        </span>
        <span
          className={`mx-2 ${!open ? "active-tab" : null}`}
          onClick={() => showAsQuestion(idx)}
        >
          View{" "}
        </span>
      </div>
      {open ? (
        <div className="rounded-l-md mt-1" key={idx + "questions"}>
          <div className="w-full flex flex-col items-start p-2 md:px-6 md:py-5 ">
            <Row gutter={[16, 16]} className="w-full">
              <Col md={24} xs={24}>
                <h2 className="font-semibold text-base mb-4">
                  Question {idx + 1}
                </h2>
                <div className="space-y-3">
                  <p className="font-medium text-base mb-0">
                    What would you like to ask?
                  </p>
                  <Input
                    className="question-border h-12 rounded-md placeholder-gray-500"
                    placeholder="E.g. What whould you like to ask from a person."
                    onChange={(e) => {
                      handleQuestionValue(e.target.value, idx, true);
                    }}
                    value={questionText}
                    maxLength={180}
                  />
                </div>

                {error && <p className="text-red-600 text-sm my-2">{error}</p>}
              </Col>
              <Col md={24} xs={24}>
                <div className="mt-4 mb-2  mx-2 options-wrapper space-y-4">
                  {type === "checkbox" && (
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
                            <p className="text-red-600 text-sm my-2">
                              {op?.error}
                            </p>
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
                  )}

                  {(type === "input" || type === "textarea") && (
                    <div className="mt-3">
                      <p className="text-slate-400 text-base border-b border-slate-400">
                        {type == "input" ? "Short Text" : "Long Text"}
                      </p>
                    </div>
                  )}
                  {type === "yesno" && (
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
                  )}

                  {type == "rating" && (
                    <div>
                      <p className="font-medium text-base mb-0 text-center">
                        Rating
                      </p>
                      <div className="question-rating">
                        <Rate disabled />
                      </div>
                    </div>
                  )}

                  {type === "scale" && (
                    <>
                      <p className="font-medium text-base mb-2">
                        Opinion Scale
                      </p>
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
                                <p className="text-red-600 text-sm my-2">
                                  {options[0]?.error}
                                </p>
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
                                <p className="text-red-600 text-sm my-2">
                                  {options[1]?.error}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Col>
              <Col md={24} xs={24}>
                <div className="mt-4 w-full border-t-2 pt-4 flex justify-between items-center">
                  <Select
                    value={type}
                    onChange={(e) => defineType(e, idx)}
                    className="question-select-box w-40"
                  >
                    <Select.Option value={"input"}>Text</Select.Option>
                    <Select.Option value={"checkbox"}>
                      Multiple Choice
                    </Select.Option>
                    <Select.Option value={"textarea"}>Paragraph</Select.Option>
                    <Select.Option value={"scale"}>Opinion Scale</Select.Option>
                    <Select.Option value={"yesno"}>Yes or No</Select.Option>
                    <Select.Option value={"rating"}>Rating</Select.Option>
                  </Select>

                  <div className="flex justify-end items-center space-x-3">
                    <div
                      onClick={() => removeElement(idx)}
                      className="cursor-pointer mx-2 w-10 h-10  border rounded-full grid place-content-center hover:bg-gray-100 hover:border-red-500"
                    >
                      <Image
                        src={"/media/svg/delete.svg"}
                        alt="Delete"
                        width={20}
                        height={20}
                      />
                    </div>

                    <PrimaryButton
                      title={"Add Question"}
                      onClick={() => addNextQuestionField(idx + 1)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div
          className="shadow-lg px-2 py-5 cursor-pointer bg-question-view"
          onClick={() => handleExpand(idx)}
          key={idx + "close"}
        >
          <div className="flex flex-col  mx-auto py-5 w-9/12 space-y-6">
            <p className="ml-0 text-white text-base md:text-xl 2xl:text-2xl text-center mb-0">
              {questionText}
            </p>

            {options?.length > 0 && type === "checkbox" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {options?.map((op, j) => (
                  <div
                    key={j + "op"}
                    className="bg-white text-black px-2 py-1 text-left rounded-md flex flex-col justify-center"
                  >
                    <p className="text-sm lg:text-base 2xl:text-lg mb-0">
                      {op.optionText}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {["textarea", "input"].includes(type) && (
              <p className="text-white text-sm lg:text-base 2xl:text-lg border-b border-white">
                {type == "input" ? "Short Text" : "Long Text"}
              </p>
            )}

            {type == "rating" && (
              <div className="question-view-rating ">
                <div className="text-white text-sm lg:text-base 2xl:text-lg ">
                  <Rate disabled />
                </div>
              </div>
            )}

            {type === "scale" && options?.length > 1 && (
              <div className="flex items-baseline w-full justify-around">
                <p className="text-white text-sm lg:text-base 2xl:text-lg">
                  {options[0]?.optionText}
                </p>
                <Radio.Group
                  name="scale"
                  className="px-4 flex justify-between text-white question-view-radio-wrapper"
                  row
                >
                  {higherLabel &&
                    lowerLabel > -1 &&
                    range.length > 0 &&
                    range(lowerLabel, higherLabel).map((rg, index) => (
                      <Radio key={index + rg} value={rg} className="text-white">
                        {rg}
                      </Radio>
                    ))}
                </Radio.Group>
                <p className="text-white text-sm lg:text-base 2xl:text-lg">
                  {options[1]?.optionText}
                </p>
              </div>
            )}

            {type === "yesno" && (
              <div className="flex items-center justify-center">
                <div className="p-8 md:p-10 border mx-2 rounded-sm">
                  <LikeOutlined style={{ fontSize: "58px", color: "#fff" }} />
                </div>
                <div className="p-8 md:p-10 border mx-2 rounded-sm">
                  <DislikeOutlined
                    style={{ fontSize: "58px", color: "#fff" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionComponent;

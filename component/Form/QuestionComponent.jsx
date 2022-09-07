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
          <Col md={8} xs={12}>
            <div
              className="flex items-center question-type-bg"
              onClick={(e) => {
                defineType("input", idx);
                setSelectTypeFeild(false);
              }}
            >
              <div className=" mr-3">
                <TextIcon />
              </div>
              <div>
                <p className="mb-0">Text</p>
              </div>
            </div>
          </Col>
          <Col md={8} xs={12}>
            <div
              className="flex items-center question-type-bg"
              onClick={(e) => {
                defineType("textarea", idx);
                setSelectTypeFeild(false);
              }}
            >
              <div className=" mr-3">
                <TextIcon />
              </div>
              <p className="mb-0">Paragraph</p>
            </div>
          </Col>
          <Col md={8} xs={12}>
            <div
              className="flex items-center question-type-bg"
              onClick={(e) => {
                defineType("checkbox", idx);
                setSelectTypeFeild(false);
              }}
            >
              <div className=" mr-3">
                <CheckboxIcon />
              </div>
              <div>
                <p className="mb-0">Multiple Choice </p>
              </div>
            </div>
          </Col>
          <Col md={8} xs={12}>
            <div
              className="flex items-center question-type-bg"
              onClick={(e) => {
                defineType("scale", idx);
                setSelectTypeFeild(false);
              }}
            >
              <div className=" mr-3">
                <ScaleIcon />
              </div>
              <div>
                <p className="mb-0">Opinion Scale </p>
              </div>
            </div>
          </Col>
          <Col md={8} xs={12}>
            <div
              className="flex items-center question-type-bg "
              onClick={(e) => {
                defineType("yesno", idx);
                setSelectTypeFeild(false);
              }}
            >
              <div className=" mr-3">
                <p className="mb-0">
                  <LikeIcon />
                </p>
                <p className="mt-1 mb-0">
                  <DislikeIcon />
                </p>
              </div>
              <p className="mb-0">Yes or No</p>
            </div>
          </Col>
          <Col md={8} xs={12}>
            <div
              className="flex items-center question-type-bg "
              onClick={(e) => {
                defineType("rating", idx);
                setSelectTypeFeild(false);
              }}
            >
              <div className=" mr-3">
                <StarOutlined />
              </div>
              <div>
                <p className="mb-0">Rating </p>
              </div>
            </div>
          </Col>
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
          <div className="w-full flex flex-col items-start px-2 md:px-6 md:py-5 ">
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
                <div className="mt-4 mb-2  mx-2 options-wrapper">
                  {type === "checkbox" && (
                    <>
                      <p className="font-medium text-base mb-2">
                        Multiple choice
                      </p>
                      {options.map((op, j) => (
                        <div key={j}>
                          <div className="flex flex-row  items-center py-2">
                            <div>
                              <Input
                                placeholder={`E.g. Option ${j + 1}`}
                                className="question-border h-12 rounded-md placeholder-gray-500 w-40 xl:w-64 "
                                onChange={(e) => {
                                  handleOptionValue(e.target.value, idx, j);
                                }}
                                value={op.optionText}
                                maxLength={180}
                              />
                              {op?.error && (
                                <p className="text-red-600 text-sm my-2">
                                  {op?.error}
                                </p>
                              )}
                            </div>

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
                          </div>
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
                    <div className="mt-4">
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
                    </div>
                  )}

                  {type == "rating" && (
                    <div className="mt-3 question-rating">
                      <p className="font-medium text-base mb-0 text-center">
                        Rating
                      </p>
                      <div className="text-white text-2xl mt-3">
                        <Rate disabled />
                      </div>
                    </div>
                  )}

                  {type === "scale" && (
                    <>
                      <p className="font-medium text-base mb-0">
                        Opinion Scale
                      </p>
                      <div className="flex items-center space-x-4 md:space-x-8 mt-2 ">
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
                            <p className="ml-2 mr-4 mb-0">label </p>
                          </div>
                          {options.length > 1 && (
                            <>
                              <Input
                                placeholder="E.g. Low"
                                className="question-border text-base mt-2 rounded-md placeholder-gray-500"
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
                              className="rounded-md placeholder-gray-500"
                            >
                              <Select.Option value={5}>5</Select.Option>
                              <Select.Option value={10}>10</Select.Option>
                            </Select>
                            <p className="ml-2 mr-4 mb-0">label </p>
                          </div>
                          {options.length > 1 && (
                            <>
                              <Input
                                placeholder="E.g. High"
                                className="question-border text-base mt-2 rounded-md placeholder-gray-500"
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
                <div className="mt-4 w-full border-t-2 px-4 pt-2 flex justify-between items-center">
                  <div className="">
                    <Select
                      value={type}
                      onChange={(e) => defineType(e, idx)}
                      className="question-select-box w-full"
                    >
                      <Select.Option value={"input"}>Text</Select.Option>
                      <Select.Option value={"checkbox"}>
                        Multiple Choice
                      </Select.Option>
                      <Select.Option value={"textarea"}>
                        Paragraph
                      </Select.Option>
                      <Select.Option value={"scale"}>
                        Opinion Scale
                      </Select.Option>
                      <Select.Option value={"yesno"}>Yes or No</Select.Option>
                      <Select.Option value={"rating"}>Rating</Select.Option>
                    </Select>
                  </div>
                  <div className="flex justify-end items-center mt-1">
                    <div
                      onClick={() => removeElement(idx)}
                      className="cursor-pointer mx-2 w-10  pr-2"
                    >
                      <Image
                        src={"/media/svg/delete.svg"}
                        alt="Delete"
                        width={20}
                        height={20}
                      />
                    </div>
                    <button
                      className=" px-2 md:px-4 py-3 h-full rounded primary-bg-btn text-white  my-1"
                      type="button"
                      onClick={() => addNextQuestionField(idx + 1)}
                    >
                      <span className="MuiButton-label">Add Question</span>
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div
          className="shadow-lg   px-2 py-5 cursor-pointer bg-question-view"
          onClick={() => handleExpand(idx)}
          key={idx + "close"}
        >
          <div className="flex flex-col  mx-auto py-5 w-9/12">
            <p className="ml-0 text-white text-4xl text-center mb-0">
              {questionText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {options?.length > 0 &&
                type === "checkbox" &&
                options?.map((op, j) => (
                  <div
                    key={j + "op"}
                    className="bg-white text-black px-2 py-1 text-left rounded-md flex flex-col justify-center"
                  >
                    <p className=" text-xl mb-0">{op.optionText}</p>
                  </div>
                ))}
            </div>

            {type == "input" || type === "textarea" ? (
              <div className="mt-2">
                <p className="text-white text-xl border-b border-white">
                  {" "}
                  {type == "input" ? "Short Text" : "Long Text"}
                </p>
              </div>
            ) : null}
            {type == "rating" ? (
              <div className="mt-2 question-view-rating ">
                <div className="text-white text-xl ">
                  <Rate disabled />
                </div>
              </div>
            ) : null}

            {type === "scale" && options?.length > 1 && (
              <div className="flex items-baseline w-full justify-around mt-2">
                <p className="text-white text-xl">{options[0]?.optionText}</p>
                <Radio.Group
                  name="scale"
                  className="px-4 flex justify-between text-white question-view-radio-wrapper"
                  row
                >
                  {higherLabel &&
                    lowerLabel > -1 &&
                    range.length > 0 &&
                    range(lowerLabel, higherLabel).map((rg, index) => (
                      <Radio value={rg} className="text-white">
                        {rg}
                      </Radio>
                    ))}
                </Radio.Group>
                <p className="text-white text-xl">{options[1]?.optionText}</p>
              </div>
            )}

            {type === "yesno" && (
              <div className="mt-2">
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
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionComponent;

import { Form, Input, Select, Option } from "antd";
import { Typography } from "@material-ui/core";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
// import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { Col, Row } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import CloseIcon from "../../assets/images/close-line.svg";
import DeleteIcon from "../../assets/images/delete.svg";
// import EyeIcon from "../../assets/images/eye.svg";
import RadioGroup from "@material-ui/core/RadioGroup";

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
}) => {
  const range = (min, max) =>
    [...Array(max - min + 1).keys()].map((i) => i + min);
  console.log(selectTypeFeild, "selectTypeFeild");
  return selectTypeFeild ? (
    <>
      <p onClick={(e) => defineType("input", idx)}>Input </p>
      <p onClick={(e) => defineType("textarea", idx)}>Text Area </p>
    </>
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
                <h2 className="font-semibold text-base my-2">
                  {idx + 1}. Question
                </h2>
                <Input
                  className="question-border bg-gray-100 h-12"
                  placeholder="Question Text"
                  onChange={(e) => {
                    handleQuestionValue(e.target.value, idx, true);
                  }}
                  value={questionText}
                  maxLength={180}
                />
                {error && <p className="text-red-600 text-sm my-2">{error}</p>}
              </Col>
              <Col md={24} xs={24}>
                <h2 className="font-semibold text-base my-2">Type</h2>
                <Select
                  value={type}
                  onChange={(e) => defineType(e, idx)}
                  className="question-select-box w-full"
                >
                  <Select.Option value={"input"}>Input Box</Select.Option>
                  <Select.Option value={"checkbox"}>CheckBox</Select.Option>
                  <Select.Option value={"textarea"}>TextArea</Select.Option>
                  <Select.Option value={"scale"}>Linear Scale</Select.Option>
                </Select>
              </Col>
            </Row>

            <div className="mt-5 mb-2  mx-2 options-wrapper">
              {type === "checkbox" && (
                <>
                  {options.map((op, j) => (
                    <div key={j}>
                      <div className="flex flex-row -ml-4 justify-between py-2">
                        <Radio disabled />
                        <Input
                          placeholder="Option Text "
                          className="input-box text-base  "
                          bordered={false}
                          onChange={(e) => {
                            handleOptionValue(e.target.value, idx, j);
                          }}
                          value={op.optionText}
                          maxLength={180}
                        />

                        <button
                          onClick={() => {
                            removeOption(idx, j);
                          }}
                        >
                          <Image
                            src={CloseIcon}
                            alt="Close "
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                  {options.length < 5 ? (
                    <div
                      onClick={() => {
                        addOption(idx);
                      }}
                      className="text-sm md:text-base cursor-pointer my-2 ml-4"
                    >
                      + Add Option
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}

              {type === "scale" && (
                <>
                  <div className="flex items-center">
                    <Select
                      value={lowerLabel ?? 0}
                      onChange={(e) => {
                        handleScaleOptionValue(e, idx, "lowerLabel");
                      }}
                    >
                      <Select.Option value={0}>0</Select.Option>
                      <Select.Option value={1}>1</Select.Option>
                    </Select>

                    <p className="mx-4">To </p>

                    <Select
                      value={higherLabel ?? 5}
                      onChange={(e) => {
                        handleScaleOptionValue(e, idx, "highLabel");
                      }}
                    >
                      <Select.Option value={5}>5</Select.Option>
                      <Select.Option value={10}>10</Select.Option>
                    </Select>
                  </div>
                  {options.length > 1 && (
                    <>
                      {" "}
                      <div className="flex flex-row  items-center py-2">
                        <p className="mr-4">{lowerLabel ?? 0}</p>
                        <Input
                          placeholder="Scale Text"
                          className="input-box  text-base  w-1/2"
                          bordered={false}
                          onChange={(e) => {
                            handleOptionValue(e.target.value, idx, 0);
                          }}
                          value={options[0].optionText}
                          maxLength={180}
                        />
                      </div>
                      <div className="flex flex-row  items-center py-2">
                        <p className="mr-4">{higherLabel ?? 5}</p>
                        <Input
                          placeholder="Scale Text"
                          className="input-box text-base w-1/2"
                          bordered={false}
                          onChange={(e) => {
                            handleOptionValue(e.target.value, idx, 1);
                          }}
                          value={options[1].optionText}
                          maxLength={180}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="mt-4 w-full border-t-2 px-4 pt-2">
              <div className="flex justify-end items-center mt-1">
                {" "}
                {/* <span
                  onClick={() => showAsQuestion(idx)}
                  className="cursor-pointer w-8 pr-2 border-r-2"
                >
                  <Image src={EyeIcon} alt="Delete" width={20} height={20} />
                </span> */}
                <div
                  onClick={() => removeElement(idx)}
                  className="cursor-pointer mx-2 w-10  pr-2"
                >
                  <Image src={DeleteIcon} alt="Delete" width={20} height={20} />
                </div>
                <button
                  className=" px-4 py-3 h-full rounded primary-bg-btn text-white  my-1"
                  type="button"
                  onClick={() => addNextQuestionField(idx + 1)}
                >
                  <span className="MuiButton-label">Add Question</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="shadow-lg   px-2 pt-6 cursor-pointer bg-question-view"
          onClick={() => handleExpand(idx)}
          key={idx + "close"}
        >
          <div className="flex flex-col  mx-auto py-5 w-9/12">
            <p className="ml-0 text-white text-5xl text-center">
              {questionText}
            </p>

            <div class="grid grid-cols-3 gap-4 mt-4">
              {options?.length > 0 &&
                type === "checkbox" &&
                options?.map((op, j) => (
                  <div
                    key={j + "op"}
                    className="bg-white text-black px-2 py-1 text-left rounded-md"
                  >
                    <p className=" text-2xl">{op.optionText}</p>
                  </div>
                ))}
            </div>

            {type == "input" || type === "textarea" ? (
              <div className="mt-2">
                <p className="text-white text-2xl border-b border-white">
                  {" "}
                  {type == "input" ? "Short Text" : "Long Text"}
                </p>
              </div>
            ) : null}

            {type === "scale" && options?.length > 1 && (
              <div className="flex items-baseline w-full justify-around mt-2">
                <p className="text-white text-2xl">{options[0]?.optionText}</p>
                <RadioGroup
                  name="scale"
                  className="mx-3 flex justify-center text-white"
                  row
                >
                  {higherLabel &&
                    lowerLabel > -1 &&
                    range.length > 0 &&
                    range(lowerLabel, higherLabel).map((rg, index) => (
                      <FormControlLabel
                        value={rg}
                        control={<Radio />}
                        label={rg}
                        labelPlacement="top"
                        key={index + "range"}
                        className="text-white"
                      />
                    ))}
                </RadioGroup>
                <p className="text-white text-2xl">{options[1]?.optionText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionComponent;

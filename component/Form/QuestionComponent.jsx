import { Col, Input, Radio, Rate, Row, Select } from "antd";
import Image from "next/image";
import React from "react";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { PrimaryButton } from "../common/CustomButton";
import {
  checkInputOrTextarea,
  INPUT_TYPE,
  MULTIPLECHOICE_TYPE,
  QuestionTypeList,
  RATING_TYPE,
  SCALE_TYPE,
  TEXTAREA_TYPE,
  YESNO_TYPE,
} from "./questioncomponents/constants";
import {
  InputType,
  MultipleChoiceType,
  OpinionScaleType,
  QuestionTypeCard,
  RatingType,
  YesNoType,
} from "./questioncomponents/QuestionTypes";

const QuestionEditViewComponent = ({
  idx,
  handleQuestionValue,
  error,
  type,
  handleOptionValue,
  removeOption,
  addOption,
  lowerLabel,
  higherLabel,
  handleScaleOptionValue,
  defineType,
  addNextQuestionField,
  removeElement,
  questionText,
  options,
}) => {
  return (
    <div className="rounded-l-md mt-1">
      <div className="w-full flex flex-col items-start p-2 md:px-6 md:py-5 ">
        <Row gutter={[16, 16]} className="w-full">
          <Col md={24} xs={24}>
            <h2 className="font-semibold text-base mb-4">Question {idx + 1}</h2>
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
              {type === MULTIPLECHOICE_TYPE && (
                <MultipleChoiceType
                  idx={idx}
                  options={options}
                  handleOptionValue={handleOptionValue}
                  removeOption={removeOption}
                  addOption={addOption}
                />
              )}
              {checkInputOrTextarea(type) && <InputType type={type} />}
              {type === YESNO_TYPE && <YesNoType />}
              {type == RATING_TYPE && <RatingType />}
              {type === SCALE_TYPE && (
                <OpinionScaleType
                  idx={idx}
                  handleScaleOptionValue={handleScaleOptionValue}
                  options={options}
                  handleOptionValue={handleOptionValue}
                  lowerLabel={lowerLabel}
                  higherLabel={higherLabel}
                />
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
                <Select.Option value={INPUT_TYPE}>Text</Select.Option>
                <Select.Option value={MULTIPLECHOICE_TYPE}>
                  Multiple Choice
                </Select.Option>
                <Select.Option value={TEXTAREA_TYPE}>Paragraph</Select.Option>
                <Select.Option value={SCALE_TYPE}>Opinion Scale</Select.Option>
                <Select.Option value={YESNO_TYPE}>Yes or No</Select.Option>
                <Select.Option value={RATING_TYPE}>Rating</Select.Option>
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
  );
};

const QuestionPreViewComponent = ({
  idx,
  handleExpand,
  questionText,
  options,
  type,
  higherLabel,
  lowerLabel,
}) => {
  const range = (min, max) =>
    [...Array(max - min + 1).keys()].map((i) => i + min);
  return (
    <div
      className="shadow-lg px-2 py-5 cursor-pointer bg-question-view"
      onClick={() => handleExpand(idx)}
    >
      <div className="flex flex-col  mx-auto py-5 w-9/12 space-y-6">
        <p className="ml-0 text-white text-base md:text-xl 2xl:text-2xl text-center mb-0">
          {questionText}
        </p>

        {options?.length > 0 && type === MULTIPLECHOICE_TYPE && (
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

        {checkInputOrTextarea(type) && (
          <p className="text-white text-sm lg:text-base 2xl:text-lg border-b border-white">
            {type == INPUT_TYPE ? "Short Text" : "Long Text"}
          </p>
        )}

        {type == RATING_TYPE && (
          <div className="question-view-rating ">
            <div className="text-white text-sm lg:text-base 2xl:text-lg ">
              <Rate disabled />
            </div>
          </div>
        )}

        {type === SCALE_TYPE && options?.length > 1 && (
          <div className="flex items-baseline w-full justify-around">
            <p className="text-white text-sm lg:text-base 2xl:text-lg">
              {options[0]?.optionText}
            </p>
            <Radio.Group
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

        {type === YESNO_TYPE && (
          <div className="flex items-center justify-center">
            <div className="p-8 md:p-10 border mx-2 rounded-sm">
              <LikeOutlined style={{ fontSize: "58px", color: "#fff" }} />
            </div>
            <div className="p-8 md:p-10 border mx-2 rounded-sm">
              <DislikeOutlined style={{ fontSize: "58px", color: "#fff" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
                key={idx + "quesType"}
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
        <QuestionEditViewComponent
          idx={idx}
          handleQuestionValue={handleQuestionValue}
          error={error}
          type={type}
          handleOptionValue={handleOptionValue}
          removeOption={removeOption}
          addOption={addOption}
          lowerLabel={lowerLabel}
          higherLabel={higherLabel}
          handleScaleOptionValue={handleScaleOptionValue}
          defineType={defineType}
          addNextQuestionField={addNextQuestionField}
          removeElement={removeElement}
          questionText={questionText}
          options={options}
        />
      ) : (
        <QuestionPreViewComponent
          idx={idx}
          handleExpand={handleExpand}
          questionText={questionText}
          options={options}
          type={type}
          higherLabel={higherLabel}
          lowerLabel={lowerLabel}
        />
      )}
    </>
  );
};

export default QuestionComponent;

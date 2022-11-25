import { Col, Row, Select, Tooltip } from "antd";
import Image from "next/image";
import React from "react";
import { ButtonGray } from "../common/CustomButton";
import { CustomInput } from "../common/CustomFormFeilds";
import ErrorBox from "../common/ErrorBox";
import {
  INPUT_TYPE,
  MULTIPLE_CHOICE_TYPE,
  QuestionTypeList,
  RATING_TYPE,
  SCALE_TYPE,
  TEXTAREA_TYPE,
  YESNO_TYPE,
} from "./questioncomponents/constants";
import {
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
  ratingState,
  totalQuestionCount,
}) => {
  return (
    <div className="divide-y">
      <div className="p-4 md:px-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-base xl:text-lg">
          Question {idx + 1}
        </h2>
        <div>
          <Tooltip
            placement="topRight"
            trigger={"hover"}
            title="Change Question Type"
          >
            <Select
              value={type}
              size="default"
              onChange={(e) => defineType(e, idx)}
              className="question-select-box w-32 sm:w-40 md:w-44"
            >
              <Select.Option value={INPUT_TYPE}>Text</Select.Option>
              <Select.Option value={TEXTAREA_TYPE}>Paragraph</Select.Option>
              <Select.Option value={MULTIPLE_CHOICE_TYPE}>
                Multiple Choice
              </Select.Option>
              <Select.Option value={SCALE_TYPE}>Opinion Scale</Select.Option>
              <Select.Option value={YESNO_TYPE}>Yes or No</Select.Option>
              {!ratingState && (
                <Select.Option value={RATING_TYPE}>Rating</Select.Option>
              )}
            </Select>
          </Tooltip>
        </div>
      </div>

      <div className="p-4 md:px-5  mb-1 xl:mb-3 space-y-4">
        <div className="space-y-3">
          <p className="font-medium text-base mb-0">
            What would you like to ask?
          </p>
          <CustomInput
            placeholder="E.g. What whould you like to ask from a person."
            onChange={(e) => {
              handleQuestionValue(e.target.value, idx, true);
            }}
            value={questionText}
            maxLength={180}
          />
          <ErrorBox error={error} />
        </div>

        {[MULTIPLE_CHOICE_TYPE, YESNO_TYPE, RATING_TYPE, SCALE_TYPE].includes(
          type
        ) && (
          <div className="space-y-4">
            {type === MULTIPLE_CHOICE_TYPE && (
              <MultipleChoiceType
                idx={idx}
                options={options}
                handleOptionValue={handleOptionValue}
                removeOption={removeOption}
                addOption={addOption}
              />
            )}

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
        )}
      </div>
      <div
        className={`p-4 md:px-5 flex justify-${
          totalQuestionCount > 1 ? "between" : "end"
        } items-center space-x-3`}
      >
        {totalQuestionCount > 1 && (
          <div
            onClick={() => removeElement(idx, type)}
            className="cursor-pointer mx-2 w-10 h-10  border rounded-full grid place-content-center hover:bg-gray-100 hover:border-red-500"
          >
            <Image
              src={"/media/svg/delete.svg"}
              alt="Delete"
              width={20}
              height={20}
            />
          </div>
        )}

        <ButtonGray
          title={"Add Question"}
          className="shadow-sm"
          onClick={() => addNextQuestionField(idx + 1)}
        />
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
  error = "",
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
  ratingState,
  totalQuestionCount,
}) => {
  return selectTypeFeild ? (
    <>
      <div className="p-4 md:px-5  border-b border-gray-200">
        <p className="text-base 2xl:text-lg font-semibold">
          Choose Question Type
        </p>
      </div>
      <div className="p-4 md:px-5">
        <Row
          gutter={[
            { xs: 8, sm: 8, md: 8, xl: 16 },
            { xs: 8, sm: 8, md: 8, xl: 16 },
          ]}
        >
          {QuestionTypeList.filter((queType) =>
            ratingState ? (queType.type === "rating" ? false : true) : queType
          ).map((quesType) => (
            <Col xs={24} sm={12} md={8} key={quesType.title}>
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
    </>
  ) : (
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
      ratingState={ratingState}
      totalQuestionCount={totalQuestionCount}
    />
  );
};

export default QuestionComponent;

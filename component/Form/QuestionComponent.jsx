import { Col, Row, Select } from "antd";
import Image from "next/image";
import React from "react";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import { CustomInput } from "../common/CustomFormFeilds";
import ErrorBox from "../common/ErrorBox";
import {
  INPUT_TYPE,
  MULTIPLECHOICE_TYPE,
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
      <div className="p-2 md:py-3 md:px-5  flex flex-wrap items-center justify-between space-x-4">
        <h2 className="font-semibold text-base ">Question {idx + 1}</h2>
        <div>
          <Select
            value={type}
            onChange={(e) => defineType(e, idx)}
            className="question-select-box w-40"
          >
            <Select.Option value={INPUT_TYPE}>Text</Select.Option>
            <Select.Option value={TEXTAREA_TYPE}>Paragraph</Select.Option>
            <Select.Option value={MULTIPLECHOICE_TYPE}>
              Multiple Choice
            </Select.Option>
            <Select.Option value={SCALE_TYPE}>Opinion Scale</Select.Option>
            <Select.Option value={YESNO_TYPE}>Yes or No</Select.Option>
            {!ratingState && (
              <Select.Option value={RATING_TYPE}>Rating</Select.Option>
            )}
          </Select>
        </div>
      </div>

      <div className="p-2 md:py-3 md:px-5 mb-1 space-y-4">
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

        {[MULTIPLECHOICE_TYPE, YESNO_TYPE, RATING_TYPE, SCALE_TYPE].includes(
          type
        ) && (
          <div className="space-y-4">
            {type === MULTIPLECHOICE_TYPE && (
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
        className={`p-2 md:py-3 md:px-5 flex justify-${
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

        <SecondaryButton
          title={"Add Question"}
          className="bg-gray-50 border font-medium border-gray-200 text-primary hover:bg-gray-100 shadow-sm"
          onClick={() => addNextQuestionField(idx + 1)}
        />
      </div>
    </div>
  );
};

// const QuestionPreViewComponent = ({
//   idx,
//   handleExpand,
//   questionText,
//   options,
//   type,
//   higherLabel,
//   lowerLabel,
// }) => {
//   const range = (min, max) =>
//     [...Array(max - min + 1).keys()].map((i) => i + min);
//   return (
//     <div
//       className="shadow-lg px-2 py-5 cursor-pointer  bg-primary"
//       onClick={() => handleExpand(idx)}
//     >
//       <div className="flex flex-col  mx-auto py-5 w-9/12 space-y-6">
//         <p className="ml-0 text-white text-base md:text-xl 2xl:text-2xl text-center mb-0">
//           {questionText}
//         </p>

//         {options?.length > 0 && type === MULTIPLECHOICE_TYPE && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
//             {options?.map((op, j) => (
//               <div
//                 key={j + "op"}
//                 className="bg-white text-black px-2 py-1 text-left rounded-md flex flex-col justify-center"
//               >
//                 <p className="text-sm lg:text-base 2xl:text-lg mb-0">
//                   {op.optionText}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {checkInputOrTextarea(type) && (
//           <p className="text-white text-sm lg:text-base 2xl:text-lg border-b border-white">
//             {type == INPUT_TYPE ? "Short Text" : "Long Text"}
//           </p>
//         )}

//         {type == RATING_TYPE && (
//           <div className="question-view-rating ">
//             <div className="text-white text-sm lg:text-base 2xl:text-lg ">
//               <Rate disabled />
//             </div>
//           </div>
//         )}

//         {type === SCALE_TYPE && options?.length > 1 && (
//           <div className="flex items-baseline w-full justify-around">
//             <p className="text-white text-sm lg:text-base 2xl:text-lg">
//               {options[0]?.optionText}
//             </p>
//             <Radio.Group
//               className="px-4 flex justify-between text-white question-view-radio-wrapper"
//               row
//             >
//               {higherLabel &&
//                 lowerLabel > -1 &&
//                 range.length > 0 &&
//                 range(lowerLabel, higherLabel).map((rg, index) => (
//                   <Radio key={index + rg} value={rg} className="text-white">
//                     {rg}
//                   </Radio>
//                 ))}
//             </Radio.Group>
//             <p className="text-white text-sm lg:text-base 2xl:text-lg">
//               {options[1]?.optionText}
//             </p>
//           </div>
//         )}

//         {type === YESNO_TYPE && (
//           <div className="flex items-center justify-center">
//             <div className="p-8 md:p-10 border mx-2 rounded-sm">
//               <LikeOutlined style={{ fontSize: "58px", color: "#fff" }} />
//             </div>
//             <div className="p-8 md:p-10 border mx-2 rounded-sm">
//               <DislikeOutlined style={{ fontSize: "58px", color: "#fff" }} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

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
  ratingState,
  totalQuestionCount,
}) => {
  return selectTypeFeild ? (
    <>
      <div className="p-2 md:py-3 md:px-5 border-b border-gray-200">
        <p className="text-base 2xl:text-lg font-semibold">
          Choose Question Type
        </p>
      </div>
      <div className="my-4 mx-6">
        <Row gutter={[16, 16]}>
          {QuestionTypeList.filter((queType) =>
            ratingState ? (queType.type === "rating" ? false : true) : queType
          ).map((quesType) => (
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
    </>
  ) : (
    <>
      {/* <div className="flex items-center justify-center question-edit-view">
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
      </div> */}
      {/* {open ? ( */}
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
      {/* ) : (
        <QuestionPreViewComponent
          idx={idx}
          handleExpand={handleExpand}
          questionText={questionText}
          options={options}
          type={type}
          higherLabel={higherLabel}
          lowerLabel={lowerLabel}
        />
      )} */}
    </>
  );
};

export default QuestionComponent;

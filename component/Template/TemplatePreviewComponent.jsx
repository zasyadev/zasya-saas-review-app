import { Rate } from "antd";
import React from "react";
import { PrimaryButton } from "../common/CustomButton";
import { QuestiontypeText } from "../Form/questioncomponents/constants";

const TypeComponent = ({ type, questionText, options }) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-primary font-medium text-sm">
          {QuestiontypeText(type)}
        </p>
      </div>
      <div className="p-4 2xl:p-5  font-medium bg-gray-200 rounded-md space-y-3">
        <p className="mb-0 text-base">{questionText}</p>
        {type === "checkbox" && options.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, idx) => {
              return (
                <p
                  className="bg-white py-2 px-4 rounded-md flex flex-col justify-center mb-0"
                  key={idx + "mcop"}
                >
                  {option.optionText}
                </p>
              );
            })}
          </div>
        )}
        {type === "scale" && options.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, idx) => {
              return (
                <p
                  className="  bg-white py-2 px-4 rounded-md flex flex-col justify-center mb-0"
                  key={idx + "scop"}
                >
                  {option.optionText}
                </p>
              );
            })}
          </div>
        )}
        {type === "rating" && (
          <div className="flex items-center justify-center">
            <div className="bg-white py-1 px-4 rounded-md">
              <Rate disabled />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function TemplatePreviewComponent({ length, formTitle, questions }) {
  return (
    <div className="answer-preview space-y-4">
      <div className="bg-white p-2 md:px-5 md:py-5 shadow-md md:w-10/12 2xl:w-8/12 mx-auto rounded-md flex items-start justify-between gap-3">
        <div className="flex-1   space-y-3">
          <p className="text-lg font-bold text-primary mb-1">{formTitle}</p>
          <p className="mb-1 font-medium">{length} Questions</p>
        </div>
        <PrimaryButton
          withLink={true}
          linkHref={`/review/edit/${questions.id}`}
          title={"Use template"}
        />
      </div>

      <div className=" bg-white rounded-md p-2 md:px-5 md:py-5 shadow-md  md:w-10/12 2xl:w-8/12  mx-auto space-y-5">
        {questions.length &&
          questions.map((ques, idx) => {
            return <TypeComponent key={idx + "ques"} {...ques} />;
          })}
      </div>
    </div>
  );
}

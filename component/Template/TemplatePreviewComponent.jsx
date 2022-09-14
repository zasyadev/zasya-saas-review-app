import { Rate } from "antd";
import React from "react";
import { QuestiontypeText } from "../Form/questioncomponents/constants";

const TypeComponent = ({ type, questionText, options }) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-primary font-medium text-base">
          {QuestiontypeText(type)}
        </p>
      </div>
      <div className="p-3 bg-gray-200 rounded-md space-y-3">
        <p>{questionText}</p>
        {type === "checkbox" && options.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, idx) => {
              return (
                <p
                  className="  bg-white py-2 px-4 rounded-md flex flex-col justify-center"
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
                  className="  bg-white py-2 px-4 rounded-md flex flex-col justify-center"
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
      <div className=" bg-white rounded-md p-2 md:px-5 md:py-5 shadow-md md:w-7/12 mx-auto space-y-3">
        <p className="text-lg font-bold text-primary">{formTitle}</p>
        <p>{length} Questions</p>
      </div>

      <div className=" bg-white rounded-md p-2 md:px-5 md:py-5 shadow-md md:w-7/12 mx-auto space-y-3">
        {questions.length &&
          questions.map((ques, idx) => {
            return <TypeComponent key={idx + "ques"} {...ques} />;
          })}
      </div>
    </div>
  );
}

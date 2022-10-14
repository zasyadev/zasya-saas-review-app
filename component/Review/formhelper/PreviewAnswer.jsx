import React from "react";

const TypeComponent = ({ questionText, option, index }) => {
  return (
    <div className="space-y-2 ">
      <p className="text-primary font-medium text-base">
        <span className="mr-2">{index + 1 + "."}</span>
        {questionText}
      </p>

      <p className=" px-4 py-2 bg-gray-100 rounded-md flex flex-col justify-center mb-0 font-medium ">
        {option}
      </p>
    </div>
  );
};

export function PreviewAnswer({ length, formTitle, questions }) {
  return (
    <div className="answer-preview space-y-4">
      <div className=" bg-white rounded-md p-2 md:px-5 md:py-5 shadow-md md:w-10/12 2xl:w-8/12 mx-auto space-y-3">
        <p className="text-lg font-bold text-primary mb-1">{formTitle}</p>
        <p className="mb-1 font-medium">{length} Questions</p>
      </div>

      <div className=" bg-white rounded-md p-2 md:px-5 md:py-5 shadow-md md:w-10/12 2xl:w-8/12 mx-auto space-y-5">
        {questions.length &&
          questions.map((ques, idx) => {
            return <TypeComponent key={idx + "ques"} {...ques} index={idx} />;
          })}
      </div>
    </div>
  );
}

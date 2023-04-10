import React from "react";

const PreviewAnswerQuestionCard = ({
  questionText,
  questionNumber,
  option,
}) => {
  return (
    <div className="space-y-2 ">
      <p className="font-medium text-base">
        <span className="mr-2">{questionNumber + 1 + "."}</span>
        {questionText}
      </p>

      <p className=" px-4 py-2 bg-gray-100 rounded-md flex flex-col justify-center mb-0 font-medium ">
        {option}
      </p>
    </div>
  );
};

export default PreviewAnswerQuestionCard;

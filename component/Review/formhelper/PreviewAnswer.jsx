import React from "react";
import PreviewAnswerQuestionCard from "../../Template/components/PreviewAnswerQuestionCard";

function PreviewAnswer({ length, formTitle, questions }) {
  return (
    <div className="answer-preview space-y-4">
      <div className=" bg-white rounded-md p-3 md:p-5 shadow-md md:w-10/12 2xl:w-8/12 mx-auto space-y-3">
        <p className="text-lg font-bold  mb-1">{formTitle}</p>
        <p className="mb-1 font-medium">{length} Questions</p>
      </div>

      <div className=" bg-white rounded-md p-3 md:p-5 shadow-md md:w-10/12 2xl:w-8/12 mx-auto space-y-5">
        {questions.length &&
          questions.map((question, idx) => (
            <PreviewAnswerQuestionCard
              key={idx + "ques"}
              questionText={question?.questionText}
              option={question?.option}
              questionNumber={idx}
            />
          ))}
      </div>
    </div>
  );
}

export default PreviewAnswer;

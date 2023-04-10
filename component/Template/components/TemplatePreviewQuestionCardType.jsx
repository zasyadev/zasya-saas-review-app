import { Rate } from "antd";
import React from "react";
import {
  MULTIPLE_CHOICE_TYPE,
  QuestiontypeText,
  RATING_TYPE,
  SCALE_TYPE,
} from "../../Form/questioncomponents/constants";

const TemplatePreviewQuestionCardType = ({
  type,
  questionText,
  options = [],
}) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold text-sm">{QuestiontypeText(type)}</p>
      </div>
      <div className="p-4 2xl:p-5 font-medium bg-gray-200 rounded-md space-y-3">
        <p className="mb-0 text-base">{questionText}</p>
        {type === MULTIPLE_CHOICE_TYPE && options?.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, idx) => (
              <p
                className="bg-white py-2 px-4 rounded-md flex flex-col justify-center mb-0"
                key={idx + "mcop"}
              >
                {option.optionText}
              </p>
            ))}
          </div>
        )}
        {type === SCALE_TYPE && Number(options?.length) > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="  bg-white py-2 px-4 rounded-md flex flex-col justify-center mb-0">
              {options[0]?.optionText} ({options[0]?.lowerLabel})
            </p>
            <p className="  bg-white py-2 px-4 rounded-md flex flex-col justify-center mb-0">
              {options[1]?.optionText} ({options[0]?.higherLabel})
            </p>
          </div>
        )}
        {type === RATING_TYPE && (
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

export default TemplatePreviewQuestionCardType;

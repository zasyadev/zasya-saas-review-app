import React, { useMemo } from "react";
import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import {
  MULTIPLECHOICE_TYPE,
  SCALE_TYPE,
} from "../Form/questioncomponents/constants";

function TemplateSidebarQuestionCard({
  isActive,
  idx,
  handleSelect,
  handleRemove,
  question,
}) {
  const isValidQuestion = useMemo(() => {
    let optionErrors = [];
    if ([MULTIPLECHOICE_TYPE, SCALE_TYPE].includes(question.type)) {
      optionErrors = question.options.filter((item) => item.error);
    }
    return question.error ? question.error : optionErrors.length;
  }, [question]);

  return (
    <div
      className={`dragable-div question-section-wrapper cursor-pointer    ${
        isActive ? "border-l-primary border-l-2" : ""
      }
${isValidQuestion ? "border-x border-x-red-500 bg-red-50" : ""}


    `}
    >
      <div className="flex items-center">
        <div
          className=" dragable-content cursor-grab py-3 px-2 leading-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <HolderOutlined className="text-lg  lg:text-xl" />
        </div>

        <div
          className="flex flex-1 items-center space-x-3 py-3 pr-3 pl-1 justify-between"
          onClick={() => handleSelect()}
        >
          <div className="flex space-x-2 items-center flex-1">
            <p className=" rounded-full w-6 h-6 bg-primary text-white grid place-content-center mb-0">
              {idx + 1}
            </p>

            <p className="mb-0 flex-1 font-medium text-primary single-line-clamp">
              {question?.questionText}
            </p>
          </div>

          {idx !== 0 && (
            <div
              className="border  hover:border-red-600 w-6 h-6 rounded-full  grid place-content-center text-red-600  cursor-pointer leading-0"
              onClick={(e) => handleRemove(e)}
            >
              <CloseOutlined />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateSidebarQuestionCard;

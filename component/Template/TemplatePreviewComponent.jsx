import React from "react";
import { PrimaryButton } from "../common/CustomButton";
import TemplatePreviewQuestionCardType from "./components/TemplatePreviewQuestionCardType";

export function TemplatePreviewComponent({
  length,
  formTitle,
  questions,
  previewMode = false,
  templateId = "",
}) {
  return (
    <div className="answer-preview space-y-4">
      <div className="bg-white p-4 md:p-5 shadow-md md:w-10/12 2xl:w-8/12 mx-auto rounded-md flex items-start justify-between gap-3">
        <div className="flex-1   space-y-3">
          <p className="text-lg font-bold text-primary mb-1">{formTitle}</p>
          <p className="mb-1 font-medium">{length} Questions</p>
        </div>
        {previewMode && (
          <PrimaryButton
            withLink={true}
            linkHref={`/review/edit/${templateId}`}
            title={"Use template"}
          />
        )}
      </div>

      <div className=" bg-white rounded-md p-4 md:p-5 shadow-md  md:w-10/12 2xl:w-8/12  mx-auto space-y-5">
        {questions.length &&
          questions.map((ques, idx) => (
            <TemplatePreviewQuestionCardType key={idx + "ques"} {...ques} />
          ))}
      </div>
    </div>
  );
}

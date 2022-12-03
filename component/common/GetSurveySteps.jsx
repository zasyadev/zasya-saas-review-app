import { Form, Radio, Select } from "antd";
import React from "react";
import EditorWrapperComponent from "../Review/EditorWrapperComponent";
import { TemplatePreviewComponent } from "../Template/TemplatePreviewComponent";
import { CustomInput, CustomTextArea } from "./CustomFormFeilds";

const SurveyTitleStep = () => {
  return (
    <div className="w-full md:w-1/2 bg-white  mx-auto rounded-md">
      <div className="text-primary text-base md:text-lg  font-bold border-b border-gray-200 p-4 md:py-5 md:px-6">
        Share a Survey
      </div>
      <div className="p-4 md:py-5 md:px-6 space-y-5">
        <p className="text-base font-bold  text-primary">
          Please enter your survey title
        </p>

        <Form.Item
          name="survey_name"
          rules={[
            {
              required: true,
              message: "Please enter your survey title",
            },
          ]}
        >
          <CustomInput placeholder="for eg: Monthly survey , Lastest trip survey , weekly survey ... " />
        </Form.Item>

        <p className="text-base font-bold  text-primary">
          Please enter your survey description
        </p>
        <Form.Item
          name="survey_des"
          rules={[
            {
              required: true,
              message: "Please enter your survey title",
            },
          ]}
        >
          <CustomTextArea
            placeholder="E.g. Survey Description"
            customclassname="w-full"
            rows={5}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default function GetSurveySteps({
  type,
  questionList,
  setQuestionList,
  formTitle,
  urlId,
}) {
  switch (type) {
    case 0:
      return <SurveyTitleStep type={type} />;
    case 1:
      return (
        <EditorWrapperComponent
          questions={questionList}
          setQuestionList={setQuestionList}
        />
      );

    case 2:
      return (
        <TemplatePreviewComponent
          length={questionList.length}
          formTitle={formTitle}
          questions={questionList}
        />
      );

    default:
      return null;
  }
}

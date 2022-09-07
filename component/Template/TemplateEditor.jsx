import { CloseOutlined } from "@ant-design/icons";
import { Col, Input, Row } from "antd";
import React from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import QuestionComponent from "../Form/QuestionComponent";

function TemplateEditor({
  setFormTitle,
  questions,
  setActiveQuestionIndex,
  setSelectTypeFeild,
  removeElement,
  addMoreQuestionField,
  activeQuestionIndex,
  editMode,
  defineType,
  showAsQuestion,
  handleExpand,
  addOption,
  handleQuestionValue,
  handleOptionValue,
  removeOption,
  handleScaleOptionValue,
  addNextQuestionField,
  selectTypeFeild,
  saveFormField,
  formTitle,
  saveWrapper = false,
}) {
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <div className="mb-2 px-1 template-title-input">
          <Input
            placeholder="Template Title"
            value={formTitle}
            onChange={(e) => {
              setFormTitle(e.target.value);
            }}
            className="input-box text-2xl template-title px-4 py-3"
            bordered={false}
            maxLength={180}
          />
        </div>
        <div className="w-full bg-white rounded-md shadow-md  mt-4 add-template-wrapper sider-question-wrapper overflow-auto">
          <div className="question-section-container">
            <div className="question-section-contents">
              <div className="question-section-contents-card">
                {questions?.length > 0 &&
                  questions?.map((question, idx) => (
                    <div
                      className={` question-section-wrapper p-4 cursor-pointer ${
                        idx == questions?.length - 1 ? null : "border-bottom"
                      }  ${
                        idx === activeQuestionIndex
                          ? "border-l-primary border-l-2"
                          : ""
                      }`}
                      key={idx + "side que"}
                    >
                      <div className="flex justify-between">
                        <div className="w-full">
                          <div
                            className="flex items-center"
                            onClick={() => {
                              setActiveQuestionIndex(idx);
                              setSelectTypeFeild(false);
                            }}
                          >
                            <span className=" rounded-full linear-bg">
                              {idx + 1}
                            </span>

                            <span className=" px-2 py-1 ">
                              <span className="">{question?.questionText}</span>
                            </span>
                          </div>
                        </div>

                        {idx !== 0 && (
                          <div className="">
                            <span
                              className=" dark-blue-bg cursor-pointer"
                              onClick={() => removeElement(idx)}
                            >
                              <CloseOutlined className="text-xs" />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-between ">
          <PrimaryButton
            onClick={() => addMoreQuestionField()}
            className=" px-1 md:px-4 h-full rounded w-3/4 md:w-1/2 my-1 mr-1"
            title="git New Question"
          />

          {saveWrapper && (
            <SecondaryButton
              withLink={true}
              linkHref="/template"
              className="h-full rounded w-1/3  my-1"
              title="Cancel"
            />
          )}
        </div>
      </Col>
      <Col xs={24} md={16}>
        <div className="w-full bg-white rounded-md shadow-md mt-4 add-template-wrapper">
          <div className="rounded-md overflow-hidden  mt-1">
            {questions?.length > 0 &&
              questions
                ?.filter((_, index) => index === activeQuestionIndex)
                ?.map((question) => (
                  <QuestionComponent
                    key={activeQuestionIndex + "QuestionComponent"}
                    {...question}
                    editMode={editMode}
                    idx={activeQuestionIndex}
                    removeElement={removeElement}
                    defineType={defineType}
                    showAsQuestion={showAsQuestion}
                    handleExpand={handleExpand}
                    addOption={addOption}
                    handleQuestionValue={handleQuestionValue}
                    handleOptionValue={handleOptionValue}
                    removeOption={removeOption}
                    handleScaleOptionValue={handleScaleOptionValue}
                    addNextQuestionField={addNextQuestionField}
                    selectTypeFeild={selectTypeFeild}
                    setSelectTypeFeild={setSelectTypeFeild}
                  />
                ))}
          </div>
        </div>
        {saveWrapper && (
          <div className="block lg:flex justify-end items-end my-4  lg:pl-56 ">
            <PrimaryButton
              onClick={() => saveFormField()}
              className=" my-1 ml-2 rounded"
              title="Save"
            />
          </div>
        )}
      </Col>
    </Row>
  );
}

export default TemplateEditor;

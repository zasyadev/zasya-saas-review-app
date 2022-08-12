import React from "react";
import { Input, Row, Col, Form, Button } from "antd";
import QuestionComponent from "../Form/QuestionComponent";
import { CloseOutlined } from "@ant-design/icons";
import Link from "next/link";

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
        <div className="w-full bg-white rounded-xl shadow-md  mt-4 add-template-wrapper sider-question-wrapper overflow-auto">
          <div className="rounded-t-md  mt-1">
            <div className="question-section-container">
              <div className="question-section-contents">
                <div className="question-section-contents-card">
                  {questions?.length > 0 &&
                    questions?.map((question, idx) => (
                      <div
                        className={` question-section-wrapper my-1 px-4 py-3 cursor-pointer ${
                          idx == questions?.length - 1 ? null : "border-bottom"
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
                                <span className="">
                                  {question?.questionText}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="">
                            <span
                              className=" dark-blue-bg cursor-pointer"
                              onClick={() => removeElement(idx)}
                            >
                              <CloseOutlined className="text-xs" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-between ">
          <button
            className=" px-1 md:px-4 py-3 h-full rounded primary-bg-btn text-white w-3/4 md:w-1/2 my-1 mr-1"
            type="button"
            onClick={() => {
              addMoreQuestionField();
            }}
          >
            <span className="MuiButton-label">Add New Question</span>
          </button>
          {saveWrapper && (
            <Link href={"/template"}>
              <button
                className="py-3 h-full rounded toggle-btn-bg text-white  w-1/3  my-1"
                type="button"
              >
                <span className="MuiButton-label">Cancel</span>
              </button>
            </Link>
          )}
        </div>
      </Col>
      <Col xs={24} md={16}>
        <div className="w-full bg-white rounded-xl shadow-md mt-4 add-template-wrapper">
          <div className="rounded-t-md  mt-1">
            {questions?.length > 0 &&
              questions
                ?.filter((_, index) => index === activeQuestionIndex)
                ?.map((question) => (
                  <QuestionComponent
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
            <button
              className=" px-4 py-3 h-full rounded primary-bg-btn text-white  my-1 ml-2"
              type="button"
              onClick={() => {
                saveFormField();
              }}
            >
              <span className="MuiButton-label">Save </span>
            </button>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default TemplateEditor;

import { CloseOutlined, HolderOutlined } from "@ant-design/icons";
import { Col, Input, Row } from "antd";
import React from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import DragableComponent from "../common/DragableComponent";
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
  setQuestions,
}) {
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <div className="w-full pb-2">
          {/* <div className="mb-2 px-1 template-title-input">
            <Input
              placeholder="E.g. Template Title"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
              className="input-box text-2xl  px-4 py-3"
              bordered={false}
              maxLength={180}
            />
          </div> */}

          <div className="w-full bg-white rounded-md shadow-md   sider-question-wrapper overflow-y-auto">
            <div className="question-section-container">
              <div className="question-section-contents">
                <div className="question-section-contents-card">
                  {questions?.length > 0 && (
                    <DragableComponent
                      stateData={questions}
                      handleChange={(newStateData, fromIndex, toIndex) => {
                        setQuestions(newStateData);

                        if (fromIndex === activeQuestionIndex)
                          setActiveQuestionIndex(toIndex);
                      }}
                    >
                      {questions?.map((question, idx) => (
                        <div
                          className={`dragable-div question-section-wrapper cursor-pointer ${
                            idx == questions?.length - 1
                              ? null
                              : "border-bottom"
                          }  ${
                            idx === activeQuestionIndex
                              ? "border-l-primary border-l-2"
                              : ""
                          }`}
                          key={idx + "side_que"}
                        >
                          <div className="flex items-center">
                            <div
                              className=" dragable-content cursor-move py-3 px-2 leading-0"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <HolderOutlined className="text-lg  lg:text-xl " />
                            </div>

                            <div
                              className="flex flex-1 items-center space-x-3 py-3 pr-3 pl-1 justify-between"
                              onClick={() => {
                                setActiveQuestionIndex(idx);
                                setSelectTypeFeild(false);
                              }}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeElement(idx);
                                  }}
                                >
                                  <CloseOutlined />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </DragableComponent>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-between space-x-3">
            <PrimaryButton
              onClick={() => addMoreQuestionField()}
              title="Add New Question"
            />

            {/* {saveWrapper && (
              <SecondaryButton
                withLink={true}
                linkHref="/template"
                title="Cancel"
              />
            )} */}
          </div>
        </div>
      </Col>
      <Col xs={24} md={16}>
        <div className="w-full bg-white rounded-md shadow-md  add-template-wrapper">
          <div className="rounded-md overflow-hidden  ">
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
        {/* {saveWrapper && (
          <div className="block lg:flex justify-end items-end my-4  lg:pl-56 ">
            <PrimaryButton
              onClick={() => saveFormField()}
              className=" my-1 ml-2 rounded"
              title="Save"
            />
          </div>
        )} */}
      </Col>
    </Row>
  );
}

export default TemplateEditor;

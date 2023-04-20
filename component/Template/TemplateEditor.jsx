import { Col, Row } from "antd";
import React from "react";
import { PrimaryButton } from "../../component/common/CustomButton";
import DragableComponent from "../common/DragableComponent";
import QuestionComponent from "../Form/QuestionComponent";
import TemplateSidebarQuestionCard from "./TemplateSidebarQuestionCard";

function TemplateEditor({
  questions,
  setActiveQuestionIndex,
  setSelectTypeFeild,
  removeElement,
  addMoreQuestionField,
  activeQuestionIndex,
  defineType,
  addOption,
  handleQuestionValue,
  handleOptionValue,
  removeOption,
  handleScaleOptionValue,
  addNextQuestionField,
  selectTypeFeild,
  setQuestions,
  ratingState = false,
}) {
  return (
    <Row gutter={{ xs: 0, sm: 0, md: 16 }}>
      <Col xs={24} md={8}>
        <div className="w-full p-4 md:p-0 lg:pb-2">
          <div className="w-full bg-white rounded-md shadow-md   sider-question-wrapper overflow-y-auto flex flex-col-reverse">
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
                      <div className="divide-y">
                        {questions?.map((question, idx) => (
                          <TemplateSidebarQuestionCard
                            isActive={idx === activeQuestionIndex}
                            idx={idx}
                            key={idx + "side_que"}
                            handleSelect={() => {
                              setActiveQuestionIndex(idx);
                              setSelectTypeFeild(false);
                            }}
                            handleRemove={(e) => {
                              e.stopPropagation();
                              removeElement(idx, question.type);
                            }}
                            question={question}
                          />
                        ))}
                      </div>
                    </DragableComponent>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-between space-x-3">
            <PrimaryButton
              onClick={() => addMoreQuestionField()}
              title="Add Question"
            />
          </div>
        </div>
      </Col>
      <Col xs={24} md={16}>
        <div className="w-full border-t border-gray-200 bg-white md:rounded-md md:shadow-md  add-template-wrapper">
          <div className="rounded-md overflow-hidden  ">
            {questions?.length > 0 &&
              questions
                ?.filter((_, index) => index === activeQuestionIndex)
                ?.map((question) => (
                  <QuestionComponent
                    key={activeQuestionIndex + "QuestionComponent"}
                    idx={activeQuestionIndex}
                    removeElement={removeElement}
                    defineType={defineType}
                    addOption={addOption}
                    handleQuestionValue={handleQuestionValue}
                    handleOptionValue={handleOptionValue}
                    removeOption={removeOption}
                    handleScaleOptionValue={handleScaleOptionValue}
                    addNextQuestionField={addNextQuestionField}
                    selectTypeFeild={selectTypeFeild}
                    setSelectTypeFeild={setSelectTypeFeild}
                    ratingState={ratingState}
                    totalQuestionCount={questions?.length}
                    question={question}
                  />
                ))}
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default TemplateEditor;

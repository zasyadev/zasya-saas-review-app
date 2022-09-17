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
  setQuestions,
  ratingState = false,
}) {
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <div className="w-full pb-2">
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
          <div className="mt-3 flex flex-wrap justify-between space-x-3">
            <PrimaryButton
              onClick={() => addMoreQuestionField()}
              title="Add New Question"
            />
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
                    ratingState={ratingState}
                    totalQuestionCount={questions?.length}
                  />
                ))}
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default TemplateEditor;

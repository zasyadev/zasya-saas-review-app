import React, { useState } from "react";
import {
  defaultOption,
  defaultQuestionConfig,
  defaultScaleQuestion,
} from "../Form/questioncomponents/constants";
import TemplateEditor from "../Template/TemplateEditor";

function EditorWrapperComponent({
  questions,
  setQuestionList,
  formTitle,
  setFormTitle,
}) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectTypeFeild, setSelectTypeFeild] = useState(false);
  function removeElement(idx) {
    setQuestionList((prev) => prev.filter((_, i) => i != idx));

    if (idx > 0) setActiveQuestionIndex(idx - 1);
    else setActiveQuestionIndex(idx);
  }

  function addMoreQuestionField() {
    setQuestionList((prev) => [...prev, defaultQuestionConfig]);
    setActiveQuestionIndex(questions.length);
    setSelectTypeFeild(true);
  }

  function addNextQuestionField(idx) {
    setActiveQuestionIndex(idx);
    setQuestionList((prev) => [
      ...prev.slice(0, idx),
      defaultQuestionConfig,
      ...prev.slice(idx),
    ]);
  }

  function defineType(type, index) {
    setQuestionList((prev) =>
      prev.map((item, i) =>
        i === index
          ? type === "scale"
            ? {
                ...defaultScaleQuestion,
                questionText: item.questionText,
              }
            : {
                ...defaultQuestionConfig,
                questionText: item.questionText,
                type: type,
              }
          : item
      )
    );
  }

  function addOption(idx) {
    setQuestionList((prev) =>
      prev.map((item, i) =>
        i === idx && item.options.length < 5
          ? {
              ...item,
              options: [...item.options, defaultOption],
            }
          : item
      )
    );
  }

  function handleQuestionValue(text, idx, isRequired = false) {
    let error = "";
    if (isRequired && !text && !text.trim()) {
      error = "Question field required!";
    }

    setQuestionList((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, questionText: text, error } : item
      )
    );
  }

  function handleOptionValue(text, idx, j, isRequired = false) {
    let error = "";
    if (isRequired && !text && !text.trim()) {
      error = "Option field required!";
    }
    setQuestionList((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              options: item.options.map((option, jdx) =>
                jdx === j ? { ...option, optionText: text, error } : option
              ),
            }
          : item
      )
    );
  }

  function handleScaleOptionValue(text, idx, type) {
    const key = type === "lowerLabel" ? "lowerLabel" : "higherLabel";
    setQuestionList((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              [key]: text,
            }
          : item
      )
    );
  }

  function removeOption(idx, j) {
    setQuestionList((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              options: item.options.filter((_, jdx) => j != jdx),
            }
          : item
      )
    );
  }

  return (
    <TemplateEditor
      formTitle={formTitle}
      setFormTitle={setFormTitle}
      questions={questions}
      removeElement={removeElement}
      setActiveQuestionIndex={setActiveQuestionIndex}
      setSelectTypeFeild={setSelectTypeFeild}
      addMoreQuestionField={addMoreQuestionField}
      activeQuestionIndex={activeQuestionIndex}
      defineType={defineType}
      addOption={addOption}
      handleQuestionValue={handleQuestionValue}
      handleOptionValue={handleOptionValue}
      removeOption={removeOption}
      handleScaleOptionValue={handleScaleOptionValue}
      addNextQuestionField={addNextQuestionField}
      selectTypeFeild={selectTypeFeild}
      setQuestions={setQuestionList}
    />
  );
}

export default EditorWrapperComponent;

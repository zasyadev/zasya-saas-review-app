import { Button } from "antd";
import { useState } from "react";
import QuestionComponent from "./QuestionComponent";

function FormComponent() {
  const defaultQuestionConfig = {
    questionText: "Question",
    options: [{ optionText: "Option 1" }],
    open: true,
    type: "checkbox",
  };
  const [questions, setQuestions] = useState([defaultQuestionConfig]);

  function removeElement(idx) {
    setQuestions((prev) => prev.filter((item, i) => i != idx));
  }

  function addMoreQuestionField() {
    expandCloseAll();
    setQuestions((prev) => [...prev, defaultQuestionConfig]);
  }
  function defineType(type, index) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, type } : item))
    );
  }

  function showAsQuestion(index) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, open: false } : item))
    );
  }
  function expandCloseAll() {
    setQuestions((prev) =>
      prev.map((item) => (item ? { ...item, open: false } : item))
    );
  }

  function handleExpand(idx) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, open: true } : { ...item, open: false }
      )
    );
  }
  function addOption(idx) {
    // let optionsOfQuestion = [...questions];
    // if (optionsOfQuestion[idx].options.length < 5) {
    //   optionsOfQuestion[idx].options.push({
    //     optionText: "Option " + (optionsOfQuestion[idx].options.length + 1),
    //   });
    // } else {
    //   console.log("Max  5 options ");
    // }
    // setQuestions(optionsOfQuestion);

    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx && item.options.length < 5
          ? {
              ...item,
              options: [...item.options, "Option " + (item.options.length + 1)],
            }
          : null
      )
    );
  }

  return (
    <div className="w-1/2 mx-auto">
      <div className="  border-t-8 rounded-t-md border-cyan-500 shadow-lg mt-4">
        <div>
          <div className="w-full flex flex-col items-start ml-4 pt-4 pb-5 ">
            <h4 className="mb-5 text-3xl">Untitled form</h4>
            <h6 className="text-md">Form description</h6>
          </div>
        </div>
      </div>

      {questions.map((question, idx) => (
        <QuestionComponent
          {...question}
          idx={idx}
          removeElement={removeElement}
          defineType={defineType}
          showAsQuestion={showAsQuestion}
          handleExpand={handleExpand}
          addOption={addOption}
        />
      ))}
      {/* <div className="shadow-lg mt-8">
        <div>
          <div className="w-full flex flex-col items-start ml-4 pt-4 pb-5 ">
            <h4 className="mb-5 text-xl">1. Question</h4>
            <Radio.Group>
              <Radio value={true}>Option</Radio>
            </Radio.Group>
          </div>
        </div>
      </div> */}

      <div className="flex justify-center my-4">
        <Button
          className=" px-4 py-2 rounded bg-cyan-500 text-white"
          type="button"
          onClick={() => {
            addMoreQuestionField();
          }}
        >
          <span className="MuiButton-label">
            Add Question
            <span className="MuiButton-endIcon MuiButton-iconSizeMedium">
              +
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
}

export default FormComponent;

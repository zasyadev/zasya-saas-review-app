import { Button, Checkbox, Col, Form, Input, Radio, Row, Select } from "antd";
import { useState } from "react";

const QuestionComponent = ({ type, idx, removeElement }) => {
  const [formType, setFormType] = useState("checkbox");
  const formTypeonChange = (e) => {
    setFormType(e);
  };

  return (
    <div className=" border-l-8 rounded-l-md border-cyan-500 shadow-lg mt-8">
      <div>
        <div className="w-full flex flex-col items-start px-4 py-5 ">
          <Row gutter={[8]} className="w-full">
            <Col md={16} xs={16}>
              <div>
                <Input placeholder="Questions" />
              </div>
            </Col>
            <Col md={8} xs={8}>
              <Select
                placeholder="Select Type"
                onChange={(e) => formTypeonChange(e)}
              >
                <Select.Option value={"input"}>Input Box</Select.Option>
                <Select.Option value={"checkbox"}>CheckBox</Select.Option>
                <Select.Option value={"textarea"}>TextArea</Select.Option>
                <Select.Option value={"selectbox"}>Selectbox</Select.Option>
              </Select>
            </Col>
          </Row>

          <div className="mt-5 mb-2 w-full">
            {formType === "input" && <Input />}
            {formType === "checkbox" && (
              <Checkbox.Group>
                <Checkbox>Option</Checkbox>
              </Checkbox.Group>
            )}
            {formType === "textarea" && <Input.TextArea />}
            {formType === "selectbox" && (
              <Select className="w-1/2">
                <Select.Option placeholder="Options">Options</Select.Option>
              </Select>
            )}
          </div>
          <div className="my-3 w-full">
            <p className="text-right">
              {" "}
              <span
                onClick={() => removeElement(idx)}
                className="cursor-pointer"
              >
                Remove
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultQuestionConfig = {
  type: "mcq",
};

function FormComponent() {
  const [questions, setQuestions] = useState([defaultQuestionConfig]);
  const [formType, setFormType] = useState("checkbox");
  function removeElement(idx) {
    let qs = [...questions];
    if (questions.length > 1) {
      qs.splice(idx, 1);
    }
    setQuestions(qs);
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
          setFormType={setFormType}
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
          class=" px-4 py-2 rounded bg-cyan-500 text-white"
          type="button"
          onClick={() => {
            setQuestions((q) => [...q, defaultQuestionConfig]);
          }}
        >
          <span class="MuiButton-label">
            Add Question
            <span class="MuiButton-endIcon MuiButton-iconSizeMedium">+</span>
          </span>
        </Button>
      </div>
    </div>
  );
}

export default FormComponent;

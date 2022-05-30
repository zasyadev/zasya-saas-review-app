import React from "react";
import { Checkbox, Col, Input, Row, Select, Radio } from "antd";
import DeleteIcon from "../../assets/images/delete.svg";
import EyeIcon from "../../assets/images/eye.svg";
import Image from "next/image";

const QuestionComponent = ({
  type,
  idx,
  removeElement,
  defineType,
  questionText,
  options,
  open,
  showAsQuestion,
  handleExpand,
  addOption,
}) => {
  console.log(questionText, "questionText");
  const formTypeonChange = (e) => {
    defineType(e, idx);
  };

  return open ? (
    <div
      className=" border-l-8 rounded-l-md border-cyan-500 shadow-lg mt-8"
      key={idx + "questions"}
    >
      <div>
        <div className="w-full flex flex-col items-start px-4 py-5 ">
          <Row gutter={[8]} className="w-full">
            <Col md={16} xs={16}>
              <div>
                <Input
                  placeholder="Questions"
                  value={questionText + " " + Number(idx + 1)}
                />
              </div>
            </Col>
            <Col md={8} xs={8}>
              <Select
                placeholder="Select Type"
                value={type}
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
            {type === "input" && <Input />}
            {type === "checkbox" && (
              <Checkbox.Group>
                {options.map((option, i) => (
                  <Checkbox key={i + "option"}>{option.optionText}</Checkbox>
                ))}
                {/* <Checkbox onClick={() => addOption(idx)}>Add Option</Checkbox> */}
              </Checkbox.Group>
            )}
            {type === "textarea" && <Input.TextArea />}
            {type === "selectbox" && (
              <Select className="w-1/2">
                <Select.Option placeholder="Options">Options</Select.Option>
              </Select>
            )}
          </div>
          <div className="mt-4 w-full border-t-2 px-4 py-2">
            <p className="text-right mt-1">
              {" "}
              <span
                onClick={() => showAsQuestion(idx)}
                className="cursor-pointer w-8 pr-2 border-r-2"
              >
                <Image src={EyeIcon} alt="Delete" width={20} height={20} />
              </span>
              <span
                onClick={() => removeElement(idx)}
                className="cursor-pointer mx-2 w-8 pr-2"
              >
                <Image src={DeleteIcon} alt="Delete" width={20} height={20} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="shadow-lg mt-8 cursor-pointer"
      onClick={() => handleExpand(idx)}
    >
      <div>
        <div className="w-full flex flex-col items-start ml-4 pt-4 pb-5 ">
          <h4 className="mb-5 text-xl">{questionText}</h4>
          <Radio.Group>
            {options?.map((option, i) => (
              <Radio key={i + "rdoption"}>{option.optionText}</Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default QuestionComponent;

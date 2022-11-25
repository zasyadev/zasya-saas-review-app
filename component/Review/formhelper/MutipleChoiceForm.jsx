import { Col, Form, Radio, Row } from "antd";
import React from "react";

const MutipleChoiceForm = ({
  id,
  defaultValue,
  options,
  handleAnswerChange,
  handleBtnDisable,
}) => {
  return (
    <Form.Item
      name={"ques" + id}
      rules={[
        {
          required: true,
          message: "",
        },
      ]}
      className="w-full h-full lg:max-w-2xl mx-auto"
    >
      <Radio.Group
        onChange={(e) => {
          handleAnswerChange(id, e.target.value, "input_box");
          handleBtnDisable(e.target.value);
        }}
        de
        className="w-full h-full "
        defaultValue={defaultValue}
        required={true}
        size="large"
      >
        <Row gutter={[32, 32]} justify="center">
          {options?.map((op, j) => (
            <Col xs={24} md={12} lg={8} key={op.optionText}>
              <Radio.Button
                className="text-center answer-radio-button w-full flex items-center justify-center p-2 lg:p-3 rounded-md"
                value={op.optionText}
              >
                {op.optionText}
              </Radio.Button>
            </Col>
          ))}
        </Row>
      </Radio.Group>
    </Form.Item>
  );
};

export default MutipleChoiceForm;

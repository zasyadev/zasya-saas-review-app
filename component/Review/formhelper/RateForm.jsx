import { Form, Rate } from "antd";
import React from "react";

const RateForm = ({
  id,
  defaultValue,
  handleBtnDisable,
  handleAnswerChange,
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
    >
      <div className="question-view-rating lg:max-w-2xl mx-auto">
        <Rate
          defaultValue={Number(defaultValue) ?? 0}
          onChange={(value) => {
            handleAnswerChange(id, value.toString());
            handleBtnDisable(value.toString());
          }}
        />
      </div>
    </Form.Item>
  );
};

export default RateForm;

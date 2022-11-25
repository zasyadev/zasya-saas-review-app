import { Form, Input } from "antd";
import React, { useState } from "react";
import { openNotificationBox } from "../../common/notification";
import { INPUT_TYPE } from "../../Form/questioncomponents/constants";

const InputForm = ({
  id,
  type,
  defaultValue,
  handleAnswerChange,
  handleBtnDisable,
}) => {
  const [maxTextLength, setMaxTextLength] = useState(180);

  const handleInputLimit = (value) => {
    if (value) {
      setMaxTextLength(180 - value.length);
    } else {
      setMaxTextLength(0);
    }
    if (value.length > 179) {
      openNotificationBox(
        "error",
        "You can't write more than 180 character",
        3,
        "input-form-error"
      );
    }
  };

  return (
    <div className="lg:max-w-2xl mx-auto">
      {type == INPUT_TYPE && (
        <div className="text-right  text-xs md:text-base text-primary mb-1 ">
          Text Limit : <span className=" font-semibold ">{maxTextLength}</span>
        </div>
      )}

      <Form.Item
        name={"ques-input" + id}
        rules={[
          {
            required: true,
            message: "",
          },
        ]}
      >
        <Input.TextArea
          size="large"
          fullWidth={true}
          className="rounded-md"
          placeholder={type == INPUT_TYPE ? "Short Text" : "Long Text"}
          rows={type == INPUT_TYPE ? 2 : 4}
          onChange={(e) => {
            handleBtnDisable(e.target.value);
            handleAnswerChange(id, e.target.value);
            if (type == INPUT_TYPE) handleInputLimit(e.target.value);
          }}
          defaultValue={defaultValue}
          maxLength={type == INPUT_TYPE ? 180 : 800}
        />
      </Form.Item>
    </div>
  );
};

export default InputForm;

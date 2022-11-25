import { Form, Slider } from "antd";
import React, { useState } from "react";

const ScaleForm = ({
  id,
  defaultValue,
  options,
  handleBtnDisable,
  handleAnswerChange,
}) => {
  const [sliderInputValue, setSliderInputValue] = useState(
    defaultValue ? defaultValue : 0
  );

  const handleSliderInput = (value) => {
    setSliderInputValue(value ? value : 0);
  };
  return (
    <div className=" text-left  lg:max-w-2xl mx-auto">
      <div className="flex w-full justify-center items-center">
        <p>{options[0]?.optionText}</p>
        <p className="w-full text-center mx-2 md:ml-4">
          <Form.Item
            name={"ques" + id}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Slider
              defaultValue={defaultValue}
              className="rating-slider"
              min={Number(options[0]?.lowerLabel)}
              max={Number(options[0]?.higherLabel)}
              step={1}
              onChange={(value) => {
                handleAnswerChange(id, value.toString());
                handleBtnDisable(value.toString());
                handleSliderInput(value.toString());
              }}
            />
          </Form.Item>
        </p>

        <p className="rounded-full bg-primary text-white text-center mr-2 md:mr-3  py-1 md:py-2 px-1 md:px-3">
          {sliderInputValue ?? 0}
        </p>

        <p>{options[1]?.optionText}</p>
      </div>
    </div>
  );
};

export default ScaleForm;

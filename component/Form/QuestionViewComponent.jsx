import { Typography } from "@material-ui/core";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
// import { FormControl } from "@material-ui/core";

import { Input, Slider, Space, Radio } from "antd";

const { TextArea } = Input;

const QuestionViewComponent = ({
  type,
  idx,
  id,
  questionText,
  options,
  handleAnswerChange,
  lowerLabel,
  higherLabel,
  error = "",
}) => {
  const [sliderInputValue, setSliderInputValue] = useState(0);

  const range = (min, max) =>
    [...Array(max - min + 1).keys()].map((i) => i + min);

  return (
    <div
      className="shadow-md mt-8 px-2 cursor-pointer rounded border-2 review-answer"
      key={idx + "close"}
    >
      <div className="flex flex-col items-start ml-4 py-5 ">
        <p
          variant="subtitle1"
          className="ml-0 primary-color-blue font-medium text-base"
        >
          {`(${idx + 1})`} {questionText}
        </p>

        {options?.length > 0 && type === "checkbox" && (
          <div>
            <div className="flex">
              {/* <FormControl required={true}> */}
              <Radio.Group
                name="checkbox_option"
                onChange={(e) => handleAnswerChange(id, e.target.value)}
                className=""
              >
                {" "}
                <Space direction="vertical">
                  {options?.map((op, j) => (
                    <>
                      <Radio value={op.optionText}>{op.optionText}</Radio>
                      {/* <FormControlLabel 
                        // control={<Radio className="mr-2  " size="small" />}
                        label={op.optionText}
                        value={op.optionText}
                      {/* /> */}
                    </>
                  ))}
                </Space>
              </Radio.Group>
              {/* </FormControl> */}
            </div>
          </div>
        )}
        {type == "input" && (
          <Input
            size="large"
            fullWidth={true}
            placeholder="Short Text"
            maxLength={180}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            // bordered={false}
          />
        )}
        {type === "textarea" && (
          <TextArea
            fullWidth={true}
            placeholder="Long Text"
            rows={2}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            // bordered={false}
            className=""
          />
        )}

        {type === "scale" && options?.length > 1 && (
          <div className="flex w-full justify-center items-center">
            <p>{options[0]?.optionText}</p>
            <p className="w-full text-center mx-2 md:ml-4">
              <Slider
                className="rating-slider"
                min={Number(options[0]?.lowerLabel)}
                max={Number(options[0]?.higherLabel)}
                step={1}
                onChange={(e) => {
                  handleAnswerChange(id, e.toString());
                  setSliderInputValue(e);
                }}
                // value={typeof inputValue === "number" ? inputValue : 0}
              />
            </p>

            <p className="rounded-full bg-violet-400 text-white text-center mr-2 md:mr-3  py-1 md:py-2 px-1 md:px-3">
              {sliderInputValue}
            </p>

            {/* <RadioGroup
              name="scale"
              className="mx-3 flex justify-center"
              row
              onChange={(e) => handleAnswerChange(id, e.target.value)}
            >
              {Number(options[0]?.higherLabel) &&
                Number(options[0]?.lowerLabel) > -1 &&
                range.length > 0 &&
                range(
                  Number(options[0]?.lowerLabel),
                  Number(options[0]?.higherLabel)
                ).map((rg, index) => {
                  return (
                    <FormControlLabel
                      value={rg.toString()}
                      control={<Radio />}
                      label={rg}
                      labelPlacement="top"
                      key={index + "range"}
                    />
                  );
                })}
            </RadioGroup> */}
            <p>{options[1]?.optionText}</p>
          </div>
        )}
        {error ? <p className="text-red-600 text-sm my-2">{error}</p> : null}
      </div>
    </div>
  );
};

export default QuestionViewComponent;

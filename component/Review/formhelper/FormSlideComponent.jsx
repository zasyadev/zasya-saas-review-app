import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { Col, Form, Input, Radio, Rate, Row, Slider } from "antd";
import React, { useState } from "react";
import { openNotificationBox } from "../../common/notification";
import { motion } from "framer-motion";
import { PrimaryButton, SecondaryButton } from "../../common/CustomButton";

export function FormSlideComponent({
  type,
  id,
  questionText,
  options,
  handleAnswerChange,
  error = "",
  nextSlide,
  setNextSlide,
  length,
  handleSubmit,
  loadingSpin,
}) {
  const [sliderInputValue, setSliderInputValue] = useState({
    [id]: 0,
  });
  const [rateInputValue, setRateInputValue] = useState({
    [id]: 0,
  });
  const [inputLimit, setInputLimit] = useState({
    [id]: 180,
  });
  const [disable, setDisable] = useState({
    [id]: false,
  });

  const answerHandle = (queId, value) => {
    if (value && value.trim()) {
      setDisable((prev) => ({ ...prev, [`${queId}`]: true }));
    } else {
      setDisable((prev) => ({ ...prev, [`${queId}`]: false }));
    }
  };
  const handleSliderInput = (queId, value) => {
    if (value) {
      setSliderInputValue((prev) => ({ ...prev, [`${queId}`]: value }));
    } else {
      setSliderInputValue((prev) => ({ ...prev, [`${queId}`]: 0 }));
    }
  };
  const handleRateInput = (queId, value) => {
    if (value) {
      setRateInputValue((prev) => ({ ...prev, [`${queId}`]: value }));
    } else {
      setRateInputValue((prev) => ({ ...prev, [`${queId}`]: 0 }));
    }
  };
  const handleInputLimit = (queId, value) => {
    if (value) {
      setInputLimit((prev) => ({ ...prev, [`${queId}`]: 180 - value.length }));
    } else {
      setInputLimit((prev) => ({ ...prev, [`${queId}`]: 0 }));
    }
    if (type === "input" && value.length > 179) {
      openNotificationBox(
        "error",
        "You can't write more than 180 character",
        3
      );
    }
  };

  return (
    <div className="answer-preview">
      <motion.div
        key={id + "quesSlid"}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className=" text-center bg-white rounded-md py-10 shadow-md md:w-7/12 mx-auto">
          <p className="text-lg font-bold text-gray-400 ">
            {`Question ${nextSlide + 1}`}
          </p>
          <p className="text-2xl font-bold text-primary mt-5">{questionText}</p>

          {options?.length > 0 && type === "checkbox" && (
            <div className="my-10 mx-2 md:mx-10">
              <Form.Item
                name={"ques" + id}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
                className="w-full h-full"
              >
                <Radio.Group
                  onChange={(e) => {
                    handleAnswerChange(id, e.target.value, "input_box");

                    answerHandle(id, e.target.value);
                  }}
                  className="w-full h-full "
                  required={true}
                  size="large"
                >
                  <Row gutter={[32, 32]} justify="center">
                    {options?.map((op, j) => {
                      return (
                        <Col xs={24} md={12} lg={8} key={j + "option"}>
                          <Radio.Button
                            className="text-center answer-radio-button w-full flex items-center justify-center p-2 lg:p-3 rounded-md"
                            value={op.optionText}
                          >
                            {op.optionText}
                          </Radio.Button>
                        </Col>
                      );
                    })}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </div>
          )}
          {type == "input" && (
            <>
              <div className="mt-2 md:my-6 md:mx-8 mx-2 ">
                <Form.Item name={"ques" + id}>
                  <Input
                    size="large"
                    placeholder={type == "input" ? "Short Text" : ""}
                    onChange={(e) => {
                      answerHandle(id, e.target.value);
                      handleAnswerChange(id, e.target.value);
                      handleInputLimit(id, e.target.value);
                    }}
                    className="rounded-md"
                    maxLength={180}
                  />
                </Form.Item>
              </div>
              <div className="text-right md:mx-8 mx-2  text-xs md:text-base text-primary">
                Text Limit
                <span className="text-xs md:text-sm font-semibold mx-2 ">
                  {inputLimit[id] ?? 180}
                </span>
              </div>
            </>
          )}

          {type === "textarea" && (
            <div className="my-10 md:mx-8 mx-2 ">
              <Form.Item
                name={"ques" + id}
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
                  placeholder={type == "textarea" ? "Long Text" : ""}
                  rows={4}
                  onChange={(e) => {
                    handleAnswerChange(id, e.target.value);
                    answerHandle(id, e.target.value);
                  }}
                />
              </Form.Item>
            </div>
          )}

          {type === "rating" && (
            <div className="my-10 md:mx-8 mx-2 ">
              <Form.Item
                name={"ques" + id}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
              >
                <div className="question-view-rating">
                  <Rate
                    onChange={(e) => {
                      handleAnswerChange(id, e.toString());
                      answerHandle(id, e.toString());
                      handleRateInput(id, e);
                    }}
                    value={rateInputValue[id] ?? 0}
                  />
                </div>
              </Form.Item>
            </div>
          )}

          {type === "scale" && options?.length > 1 && (
            <div className=" text-left  my-10 md:mx-8 mx-2">
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
                      className="rating-slider"
                      min={Number(options[0]?.lowerLabel)}
                      max={Number(options[0]?.higherLabel)}
                      step={1}
                      onChange={(e) => {
                        handleAnswerChange(id, e.toString());

                        handleSliderInput(id, e);
                        answerHandle(id, e.toString());
                      }}
                    />
                  </Form.Item>
                </p>

                <p className="rounded-full bg-violet-400 text-white text-center mr-2 md:mr-3  py-1 md:py-2 px-1 md:px-3">
                  {sliderInputValue[id] ?? 0}
                </p>

                <p>{options[1]?.optionText}</p>
              </div>
              {error ? (
                <p className="text-red-600 text-sm my-2">{error}</p>
              ) : null}
            </div>
          )}
          {type === "yesno" && (
            <div className="my-10">
              <Form.Item
                name={"ques" + id}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
                className="w-full"
              >
                <Radio.Group
                  onChange={(e) => {
                    handleAnswerChange(id, e.target.value);
                    answerHandle(id, e.target.value);
                  }}
                  size="large"
                  className="w-full  "
                >
                  {" "}
                  <Row gutter={[32, 32]} justify="center">
                    <Col>
                      <Radio.Button
                        value={"yes"}
                        size="large"
                        className="text-center cursor-pointer answer-radio-button  p-2 lg:p-4 rounded-md"
                      >
                        <LikeOutlined style={{ fontSize: "34px" }} />
                      </Radio.Button>
                    </Col>
                    <Col>
                      <Radio.Button
                        size="large"
                        className="text-center cursor-pointer answer-radio-button  p-2 lg:p-4 rounded-md"
                        value={"no"}
                      >
                        <DislikeOutlined style={{ fontSize: "34px" }} />
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </div>
          )}

          <div className="flex items-center justify-center px-3 space-x-3">
            {nextSlide > 0 && (
              <SecondaryButton
                title={"Previous"}
                className="bg-gray-400"
                onClick={() => setNextSlide(nextSlide - 1)}
              />
            )}

            {length - 1 === nextSlide ? (
              <PrimaryButton
                title={"Submit"}
                loading={loadingSpin}
                disabled={loadingSpin}
                onClick={() => {
                  handleSubmit();
                }}
              />
            ) : (
              <PrimaryButton
                title={"Next"}
                disabled={!disable[id]}
                onClick={() => {
                  setNextSlide(nextSlide + 1);
                }}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

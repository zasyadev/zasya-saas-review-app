import {
  CloseOutlined,
  DislikeOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Col, Form, Input, Popconfirm, Radio, Rate, Row, Slider } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../common/CustomButton";
import { openNotificationBox } from "../../common/notification";
import {
  INPUT_TYPE,
  MULTIPLE_CHOICE_TYPE,
  RATING_TYPE,
  SCALE_TYPE,
  TEXTAREA_TYPE,
  YESNO_TYPE,
} from "../../Form/questioncomponents/constants";

export function FormSlideComponent({
  type,
  id,
  questionText,
  options,
  error = "",
  nextSlide,
  setNextSlide,
  totalQuestions,
  handleSubmit,
  handleAnswerChange,
}) {
  const router = useRouter();
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
    if (type === INPUT_TYPE && value.length > 179) {
      openNotificationBox(
        "error",
        "You can't write more than 180 character",
        3,
        "input-form-error"
      );
    }
  };

  return (
    <div className="answer-preview ">
      <motion.div
        key={id + "quesSlid"}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className=" text-center bg-white rounded-md shadow-md md:w-10/12 2xl:w-8/12 mx-auto px-4 lg:px-6">
          <p className="relative text-lg font-bold text-gray-400 py-4 lg:py-6 ">
            {`Question ${nextSlide + 1}/${totalQuestions}`}
            <Popconfirm
              title={
                <p className="font-medium mb-0">
                  Are you sure you want to close review?
                </p>
              }
              okText="Yes"
              cancelText="No"
              onConfirm={() => router.back()}
              placement="right"
              overlayClassName="max-w-sm"
            >
              <span className="absolute top-2 lg:top-3 right-0  p-2 lg:p-3 leading-0 cursor-pointer rounded-full hover:bg-gray-100">
                <CloseOutlined />
              </span>
            </Popconfirm>
          </p>

          <div className="pb-4 lg:pb-6 space-y-4 lg:space-y-8">
            <p className="text-lg  lg:text-2xl font-bold text-primary">
              {questionText}
            </p>
            {options?.length > 0 && type === MULTIPLE_CHOICE_TYPE && (
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
                    answerHandle(id, e.target.value);
                  }}
                  className="w-full h-full "
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
            )}
            {type == INPUT_TYPE && (
              <div className="lg:max-w-2xl mx-auto">
                <div className="text-right  text-xs md:text-base text-primary mb-1 ">
                  Text Limit :{" "}
                  <span className=" font-semibold ">
                    {inputLimit[id] ?? 180}
                  </span>
                </div>
                <Form.Item name={"ques" + id}>
                  <Input.TextArea
                    size="large"
                    placeholder={type == INPUT_TYPE ? "Short Text" : ""}
                    rows={2}
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
            )}

            {type === TEXTAREA_TYPE && (
              <Form.Item
                name={"ques" + id}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
                className="lg:max-w-2xl mx-auto"
              >
                <Input.TextArea
                  size="large"
                  fullWidth={true}
                  className="rounded-md"
                  placeholder={type == TEXTAREA_TYPE ? "Long Text" : ""}
                  rows={4}
                  onChange={(e) => {
                    handleAnswerChange(id, e.target.value);
                    answerHandle(id, e.target.value);
                  }}
                />
              </Form.Item>
            )}

            {type === RATING_TYPE && (
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
                    onChange={(e) => {
                      handleAnswerChange(id, e.toString());
                      answerHandle(id, e.toString());
                      handleRateInput(id, e);
                    }}
                    value={rateInputValue[id] ?? 0}
                  />
                </div>
              </Form.Item>
            )}

            {type === SCALE_TYPE && options?.length > 1 && (
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

                  <p className="rounded-full bg-primary text-white text-center mr-2 md:mr-3  py-1 md:py-2 px-1 md:px-3">
                    {sliderInputValue[id] ?? 0}
                  </p>

                  <p>{options[1]?.optionText}</p>
                </div>
                {error && <p className="text-red-600 text-sm my-2">{error}</p>}
              </div>
            )}
            {type === YESNO_TYPE && (
              <Form.Item
                name={"ques" + id}
                rules={[
                  {
                    required: true,
                    message: "",
                  },
                ]}
                className="w-full lg:max-w-2xl mx-auto"
              >
                <Radio.Group
                  onChange={(e) => {
                    handleAnswerChange(id, e.target.value);
                    answerHandle(id, e.target.value);
                  }}
                  size="large"
                  className="w-full  "
                >
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
            )}
            <div className="flex items-center justify-center px-3 space-x-3">
              {nextSlide > 0 && (
                <SecondaryButton
                  title={"Previous"}
                  className="bg-gray-400"
                  onClick={() => setNextSlide(nextSlide - 1)}
                />
              )}

              {totalQuestions - 1 === nextSlide ? (
                <Popconfirm
                  title={
                    <p className="font-medium mb-0">
                      Are you sure you want to submit your review?
                    </p>
                  }
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleSubmit()}
                  placement="topRight"
                  overlayClassName="max-w-sm"
                >
                  <PrimaryButton title={"Submit"} />
                </Popconfirm>
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
        </div>
      </motion.div>
    </div>
  );
}

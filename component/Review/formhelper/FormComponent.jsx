import React, { createRef, useState } from "react";
import { Button, Carousel, Col, Input, Radio, Row, Slider, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Link from "next/link";

export function FormSlideComponent({
  type,
  idx,
  id,
  questionText,
  options,
  handleAnswerChange,
  lowerLabel,
  higherLabel,
  error = "",
  nextSlide,
  setNextSlide,
  length,
  handleSubmit,
}) {
  const [sliderInputValue, setSliderInputValue] = useState(0);

  return (
    <>
      <div className="h-full w-full">
        <Row>
          <Col xs={24} md={24} className="text-right">
            <Link href="/review/received">
              <button className="primary-bg-btn text-white py-2 px-4 rounded-md">
                Back
              </button>
            </Link>
          </Col>
          <Col xs={24} md={24}>
            <div className="text-center answer-preview">
              <div className="flex flex-col items-center justify-center text-center mt-5">
                <p className="text-lg font-bold text-red-400 my-5">
                  {`Question ${nextSlide + 1}`}
                </p>
                <p className="text-2xl font-bold primary-color-blue my-5">
                  {questionText}
                </p>

                {options?.length > 0 && type === "checkbox" && (
                  <Radio.Group
                    className="radio-button "
                    onChange={(e) => handleAnswerChange(id, e.target.value)}
                    required={true}
                    size="large"
                  >
                    {/* <Space direction="vertical"> */}
                    <Row justify="center">
                      {options?.map((op, j) => (
                        <>
                          <Col md={8}>
                            <p className="my-2">
                              <Radio.Button
                                size="large"
                                className="text-left"
                                value={op.optionText}
                              >
                                {op.optionText}
                              </Radio.Button>
                            </p>
                          </Col>
                        </>
                      ))}
                    </Row>
                    {/* </Space> */}
                  </Radio.Group>
                )}

                {type == "input" ? (
                  <div className="my-5 md:w-96 ">
                    <Input
                      size="large"
                      fullWidth={true}
                      placeholder={type == "input" ? "Short Text" : ""}
                      rows={1}
                      onChange={(e) => handleAnswerChange(id, e.target.value)}
                    />
                  </div>
                ) : null}

                {type === "textarea" ? (
                  <div className="my-5 md:w-96 ">
                    <TextArea
                      fullWidth={true}
                      placeholder={type == "textarea" ? "Long Text" : ""}
                      rows={1}
                      onChange={(e) => handleAnswerChange(id, e.target.value)}
                    />
                  </div>
                ) : null}

                {type === "scale" && options?.length > 1 && (
                  <div className=" text-left md:w-96">
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

                      <p>{options[1]?.optionText}</p>
                    </div>
                    {error ? (
                      <p className="text-red-600 text-sm my-2">{error}</p>
                    ) : null}
                  </div>
                )}
                <div className="my-5">
                  {nextSlide > 0 ? (
                    <button
                      className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 mx-2 "
                      onClick={() => setNextSlide(nextSlide - 1)}
                    >
                      Previous
                    </button>
                  ) : (
                    ""
                  )}

                  {length - 1 === nextSlide ? (
                    <button
                      className="toggle-btn-bg rounded-md text-lg text-white px-10 py-2 mx-2 my-2 "
                      onClick={() => handleSubmit()}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 mx-2 my-2 "
                      onClick={() => setNextSlide(nextSlide + 1)}
                    >
                      Next
                    </button>
                  )}
                  {/* <button
                      className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 mx-2 "
                      onClick={() => setNextSlide(nextSlide + 1)}
                    >
                      Next
                    </button> */}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export function InputComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center">
            <div className="text-center">
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <p className="text-xl font-bold my-5 text-red-400">
                  Question 1
                </p>
                <p className="text-2xl font-bold primary-color-blue my-5">
                  What do you feel about your current work environment?
                </p>
                <div className="my-5 w-96">
                  <Input size="large" />
                </div>
                <div className="my-5">
                  <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function OptionComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 1</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                Option to select feedback or create new template
              </p>
              <div className="text-left ">
                <Radio.Group>
                  <Radio value={1} className="text-lg primary-color-blue my-2">
                    Feedback
                  </Radio>
                  <br />
                  <Radio value={2} className="text-lg primary-color-blue my-2">
                    Create
                  </Radio>
                  <br />
                  <Radio value={3} className="text-lg primary-color-blue my-2">
                    Template
                  </Radio>
                  <br />
                  <Radio value={4} className="text-lg primary-color-blue my-2">
                    Option
                  </Radio>
                </Radio.Group>
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function TextAreaComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 3</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                Textarea to select feedback or create new template
              </p>
              <div className=" text-left w-96">
                <TextArea rows={4} />
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SliderComponent() {
  return (
    <>
      <div className="">
        <div className="answer-bg h-full w-full">
          <div className="text-center  ">
            <div className="py-24 flex flex-col items-center justify-center">
              <p className="text-xl font-bold my-5 text-red-400">Question 4</p>
              <p className="text-2xl font-bold primary-color-blue my-5">
                Rating
              </p>
              <div className=" text-left w-96">
                <Slider
                  className="rating-slider-a"

                  // value={typeof inputValue === "number" ? inputValue : 0}
                />
              </div>
              <div className="my-5">
                <button className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 ">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

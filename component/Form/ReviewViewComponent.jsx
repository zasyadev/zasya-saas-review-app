import { DislikeOutlined, EditOutlined, LikeOutlined } from "@ant-design/icons";
import { Col, Input, Radio, Rate, Row, Slider, Space } from "antd";
import React, { useState } from "react";
import { DeleteSmallTemplateIcon } from "../../assets/icons";
import {
  checkInputOrTextarea,
  INPUT_TYPE,
} from "./questioncomponents/constants";

const ReviewViewComponent = ({
  type,
  idx,
  removeElement,
  questionText,
  options,
  editableFeedback = false,
  onHandleReviewChange,
}) => {
  const sliderInputValue = 0;

  const [inputOuestion, setInputQuestion] = useState(false);

  return (
    <>
      <Row
        className="shadow-md mt-8   rounded border-2 px-2 "
        key={idx + "close"}
      >
        <Col xs={24} sm={24} md={22}>
          <div className="flex flex-col items-start ml-4 py-5">
            <div className="flex items-center  w-full">
              {inputOuestion && editableFeedback ? (
                <Input
                  placeholder="Review rating question"
                  onChange={(e) => onHandleReviewChange(e.target.value, idx)}
                  value={questionText}
                  onPressEnter={() => setInputQuestion(!inputOuestion)}
                />
              ) : (
                <p className="ml-0 text-primary font-medium text-base">
                  {`(${idx + 1})`} {questionText}
                </p>
              )}
              {editableFeedback ? (
                <p
                  className="ml-3 text-primary  text-sm cursor-pointer"
                  onClick={() => {
                    setInputQuestion(!inputOuestion);
                  }}
                >
                  <EditOutlined />
                </p>
              ) : null}
            </div>

            {options?.length > 0 && type === MULTIPLECHOICE_TYPE && (
              <div className="ml-2 my-2">
                <Radio.Group
                  name="checkbox_option"
                  disabled
                  className="radio-button"
                >
                  <Space direction="vertical">
                    {options?.map((op, j) => (
                      <>
                        <Radio
                          key={j + "option"}
                          value={op.optionText}
                          disabled
                        >
                          {op.optionText}
                        </Radio>
                      </>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            )}
            {checkInputOrTextarea(type) ? (
              <div className="review-view-input-wrraper">
                <Input
                  fullWidth={true}
                  placeholder={type == INPUT_TYPE ? "Short Text" : "Long Text"}
                  rows={1}
                  disabled
                />
              </div>
            ) : null}
            {type == RATING_TYPE && (
              <div className="mt-2 review-question-rating">
                <div className="text-white text-2xl ">
                  <Rate disabled defaultValue={3} />
                </div>
              </div>
            )}
            {type == YESNO_TYPE ? (
              <div className="mt-2">
                <div className="flex items-center justify-center">
                  <div className="p-4  border mx-2 rounded-sm">
                    <LikeOutlined
                      style={{ fontSize: "28px", color: "#0f123f" }}
                    />
                  </div>
                  <div className="p-4 border mx-2 rounded-sm">
                    <DislikeOutlined
                      style={{ fontSize: "28px", color: "#0f123f" }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {type === SCALE_TYPE && options?.length > 1 && (
              <div className="flex w-full justify-center items-center">
                <p>{options[0]?.optionText}</p>
                <p className="w-full text-center mx-2 md:ml-4">
                  <Slider
                    className="rating-slider"
                    min={Number(options[0]?.lowerLabel)}
                    max={Number(options[0]?.higherLabel)}
                    step={1}
                    disabled
                  />
                </p>

                <p className="rounded-full bg-violet-400 text-white text-center mr-2 md:mr-3  py-1 md:py-2 px-1 md:px-3">
                  {sliderInputValue}
                </p>

                <p>{options[1]?.optionText}</p>
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} sm={24} md={2} className="mx-auto my-auto">
          <div className="flex items-center justify-center md:ml-2  my-3">
            <div
              onClick={() => removeElement(idx)}
              className="bg-delete-icon rounded-full cursor-pointer py-2 px-2"
            >
              <DeleteSmallTemplateIcon />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ReviewViewComponent;

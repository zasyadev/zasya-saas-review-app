import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { LikeOutlined, DislikeOutlined, EditOutlined } from "@ant-design/icons";
import { Col, Row, Slider, Modal, Input } from "antd";
import { DeleteSmallTemplateIcon } from "../../assets/Icon/icons";

const ReviewViewComponent = ({
  type,
  idx,
  removeElement,
  questionText,
  options,
  editableFeedback = false,
  setIsModalVisible,
  isModalVisible,
  onHandleReviewChange,
}) => {
  const [sliderInputValue, setSliderInputValue] = useState(0);

  return (
    <>
      <Row
        className="shadow-md mt-8   rounded border-2 px-2 "
        key={idx + "close"}
      >
        <Col xs={24} sm={24} md={22}>
          <div className="flex flex-col items-start ml-4 py-5">
            <div className="flex items-center  w-full">
              <p className="ml-0 primary-color-blue font-medium text-base">
                {`(${idx + 1})`} {questionText}{" "}
              </p>{" "}
              {editableFeedback ? (
                <p
                  className="ml-3 primary-color-blue  text-sm cursor-pointer"
                  onClick={() => setIsModalVisible(true)}
                >
                  <EditOutlined />
                </p>
              ) : null}
            </div>

            {options?.length > 0 && type === "checkbox" && (
              <div>
                <div className="flex">
                  <RadioGroup
                    name="checkbox_option"
                    disabled
                    className="radio-button"
                  >
                    {options?.map((op, j) => (
                      <>
                        <FormControlLabel
                          control={<Radio className="mr-2  " size="small" />}
                          label={op.optionText}
                          value={op.optionText}
                          disabled
                        />
                      </>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
            {type == "input" || type === "textarea" ? (
              <TextField
                fullWidth={true}
                placeholder={type == "input" ? "Short Text" : "Long Text"}
                rows={1}
                disabled
              />
            ) : null}
            {type == "yesno" ? (
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

            {type === "scale" && options?.length > 1 && (
              <div className="flex w-full justify-center items-center">
                <p>{options[0]?.optionText}</p>
                <p className="w-full text-center mx-2 md:ml-4">
                  <Slider
                    className="rating-slider"
                    min={Number(options[0]?.lowerLabel)}
                    max={Number(options[0]?.higherLabel)}
                    step={1}
                    disabled
                    // value={typeof inputValue === "number" ? inputValue : 0}
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
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Review rating question"
          onChange={(e) => onHandleReviewChange(e.target.value, idx)}
        />
      </Modal>
    </>
  );
};

export default ReviewViewComponent;

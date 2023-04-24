import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { Col, Form, Radio, Row } from "antd";
import React from "react";

const YesNoForm = ({
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
      className="w-full lg:max-w-2xl mx-auto"
    >
      <Radio.Group
        defaultValue={defaultValue}
        onChange={(e) => {
          handleAnswerChange(id, e.target.value);
          handleBtnDisable(e.target.value);
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
  );
};

export default YesNoForm;

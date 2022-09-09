import { Form, Input, Radio, Select } from "antd";
import Link from "next/link";
import React from "react";

const FeedbackTitleStep = ({ onInputChange, type }) => {
  return (
    <>
      <p className="text-xl font-bold my-5 text-primary">
        Please enter your feedback title
      </p>
      <div className=" text-left w-96">
        <Form.Item
          name="review_name"
          rules={[
            {
              required: true,
              message: "Please enter your feedback title",
            },
          ]}
        >
          <Input
            placeholder="for eg: Monthly feedback , Lastest trip review , weekly feedback ... "
            onChange={(e) => onInputChange(e.target.value, type)}
          />
        </Form.Item>
      </div>
    </>
  );
};
const FeedbackTemplateStep = ({ onInputChange, formList, type }) => {
  return (
    <>
      <p className="text-xl font-bold my-5 text-primary">
        Please select your feedback template
      </p>
      <div className=" text-left w-96">
        <Form.Item
          name="template_id"
          rules={[
            {
              required: true,
              message: "Please select your feedback template",
            },
          ]}
        >
          <Select
            placeholder="Select Template"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            size="large"
            onChange={(e) => onInputChange(e, type)}
          >
            {formList.map((data, index) => (
              <Select.Option type={index + "form"} value={data.id}>
                {data.form_title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Link href="/template/add" passHref>
          <a target="_blank">
            <p className="text-right font-semibold">Create</p>
          </a>
        </Link>
      </div>
    </>
  );
};

const FeedbackRateStep = ({ onInputChange, type }) => {
  return (
    <>
      <p className="text-xl font-bold my-5 text-primary">
        Would you like to let your team members rate you ?
      </p>
      <div className=" text-left w-96 flex justify-center">
        <Form.Item
          name="review_type"
          rules={[
            {
              required: true,
              message: "Please select your review type",
            },
          ]}
        >
          <Radio.Group
            placeholder="Select Type"
            onChange={(e) => onInputChange(e.target.value, type)}
          >
            <Radio.Button
              value="feedback"
              className="border-0 hover:text-primary focus:outline-none before:bg-transparent"
            >
              Yes
            </Radio.Button>
            <Radio.Button
              value="other"
              className="border-0 hover:text-primary focus:outline-none before:bg-transparent"
            >
              No
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>
    </>
  );
};

export default function GetReviewSteps({ onInputChange, formList, type }) {
  switch (type) {
    case 0:
      return <FeedbackTitleStep onInputChange={onInputChange} type={type} />;

    case 1:
      return (
        <FeedbackTemplateStep
          onInputChange={onInputChange}
          formList={formList}
          type={type}
        />
      );

    case 2:
      return <FeedbackRateStep onInputChange={onInputChange} type={type} />;

    default:
      return null;
  }
}

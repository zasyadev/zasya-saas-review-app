import { Form, Radio, Select } from "antd";
import React from "react";
import EditorWrapperComponent from "../Review/EditorWrapperComponent";
import { TemplatePreviewComponent } from "../Template/TemplatePreviewComponent";
import { CustomInput, CustomTextArea } from "./CustomFormFeilds";

const FeedbackTitleStep = () => {
  return (
    <div className="w-full md:w-1/2 bg-white py-4 px-6 mx-auto rounded-md">
      <div className="text-primary text-base md:text-lg  font-bold border-b border-gray-200 pb-2">
        Assign a review
      </div>
      <p className="text-base font-bold my-5 text-primary">
        Please enter your feedback title
      </p>

      <Form.Item
        name="review_name"
        rules={[
          {
            required: true,
            message: "Please enter your feedback title",
          },
        ]}
      >
        <CustomInput placeholder="for eg: Monthly feedback , Lastest trip review , weekly feedback ... " />
      </Form.Item>

      <p className="text-base font-bold my-5 text-primary">
        Please enter your feedback description
      </p>
      <Form.Item
        name="review_des"
        rules={[
          {
            required: true,
            message: "Please enter your feedback title",
          },
        ]}
      >
        <CustomTextArea
          placeholder="E.g. Feedback Description"
          customclassname="w-full"
          rows={5}
        />
      </Form.Item>
    </div>
  );
};

const FeedbackMemberStep = ({ onInputChange, userList }) => {
  return (
    <div className="w-full md:w-1/2 bg-white py-4 px-6 mx-auto rounded-md">
      <p className="text-base font-bold my-5 text-primary">
        Please enter your feedback frequency
      </p>

      <Form.Item name="frequency" className="mb-0 margin-b-0">
        <Select
          placeholder="Select Frequency"
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(e) => onInputChange(e, "frequency")}
          size="large"
        >
          <Select.Option value="once">Once</Select.Option>
          <Select.Option value="daily">Daily</Select.Option>
          <Select.Option value="weekly">Weekly</Select.Option>
          <Select.Option value="monthly">Monthly</Select.Option>
        </Select>
      </Form.Item>

      <p className="text-base font-bold my-5 text-primary">
        Please select your feedback members
      </p>

      <Form.Item name="assigned_to_id" className="mb-0 margin-b-0">
        <Select
          mode="multiple"
          placeholder="Select Member"
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(e) => onInputChange(e, "assigned_to_id")}
          size="large"
          className="w-full"
          maxTagCount="responsive"
        >
          {userList.length > 0 && (
            <>
              <Select.Option key="all" value="all">
                ---SELECT ALL---
              </Select.Option>
              {userList.map((data, index) => (
                <Select.Option key={index + "users"} value={data?.user?.id}>
                  {data?.user?.first_name}
                </Select.Option>
              ))}
            </>
          )}
        </Select>
      </Form.Item>

      <p className="text-base font-bold my-5 text-primary">
        Would you like to let your team members rate you ?
      </p>
      <div className="  flex justify-center">
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
            onChange={(e) => onInputChange(e.target.value, "rating")}
          >
            <Radio.Button
              value="feedback"
              className="border-1 hover:text-primary focus:outline-none before:bg-transparent"
            >
              Yes
            </Radio.Button>
            <Radio.Button
              value="other"
              className="border-1  hover:text-primary focus:outline-none before:bg-transparent"
            >
              No
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export default function GetReviewSteps({
  type,
  questionList,
  setQuestionList,
  onBarInputChange,
  userList,
  formTitle,
}) {
  switch (type) {
    case 0:
      return <FeedbackTitleStep type={type} />;
    case 1:
      return (
        <EditorWrapperComponent
          questions={questionList}
          setQuestionList={setQuestionList}
        />
      );
    case 2:
      return (
        <FeedbackMemberStep
          onInputChange={onBarInputChange}
          userList={userList}
        />
      );
    case 3:
      return (
        <TemplatePreviewComponent
          length={questionList.length}
          formTitle={formTitle}
          questions={questionList}
        />
      );

    default:
      return null;
  }
}

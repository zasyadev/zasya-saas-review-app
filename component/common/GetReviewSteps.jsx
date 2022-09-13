import { Col, Form, Input, Radio, Row, Select } from "antd";
import Link from "next/link";
import React from "react";
import EditorWrapperComponent from "../Review/EditorWrapperComponent";

const FeedbackTitleStep = ({ onInputChange, type }) => {
  return (
    <div className="w-full md:w-1/2 bg-white py-4 px-6 mx-auto rounded-md">
      <p className="text-xl font-bold my-5 text-primary">
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
        <Input
          placeholder="for eg: Monthly feedback , Lastest trip review , weekly feedback ... "
          onChange={(e) => onInputChange(e.target.value, type)}
        />
      </Form.Item>
    </div>
  );
};
// const FeedbackTemplateStep = ({ onInputChange, formList, type }) => {
//   return (
//     <div className="w-full md:w-1/2 bg-white py-4 px-6 mx-auto rounded-md">
//       <p className="text-xl font-bold my-5 text-primary">
//         Please select your feedback template
//       </p>

//       <Form.Item
//         name="template_id"
//         rules={[
//           {
//             required: true,
//             message: "Please select your feedback template",
//           },
//         ]}
//       >
//         <Select
//           placeholder="Select Template"
//           showSearch
//           filterOption={(input, option) =>
//             option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//           }
//           size="large"
//           onChange={(e) => onInputChange(e, type)}
//         >
//           {formList.map((data, index) => (
//             <Select.Option type={index + "form"} value={data.id}>
//               {data.form_title}
//             </Select.Option>
//           ))}
//         </Select>
//       </Form.Item>
//       <Link href="/template/add" passHref>
//         <a target="_blank">
//           <p className="text-right font-semibold">Create</p>
//         </a>
//       </Link>
//     </div>
//   );
// };

const FeedbackMemberStep = ({ onInputChange, type, userList }) => {
  return (
    <div className="w-full md:w-1/2 bg-white py-4 px-6 mx-auto rounded-md">
      <p className="text-xl font-bold my-5 text-primary">
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

      <p className="text-xl font-bold my-5 text-primary">
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
          <Select.Option key="all" value="all">
            ---SELECT ALL---
          </Select.Option>
          {userList.map((data, index) => (
            <Select.Option key={index + "users"} value={data?.user?.id}>
              {data?.user?.first_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <p className="text-xl font-bold my-5 text-primary">
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
            onChange={(e) => onInputChange(e.target.value, type)}
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
  onInputChange,
  formList,
  type,
  questionList,
  setQuestionList,
  onBarInputChange,
  userList,
}) {
  switch (type) {
    case 0:
      return <FeedbackTitleStep onInputChange={onInputChange} type={type} />;

    // case 1:
    //   return (
    //     <FeedbackTemplateStep
    //       onInputChange={onInputChange}
    //       formList={formList}
    //       type={type}
    //     />
    //   );

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
          type={type}
          userList={userList}
        />
      );

    default:
      return null;
  }
}

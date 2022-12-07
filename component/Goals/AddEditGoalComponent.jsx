import { Form, Select } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import { CustomInput, CustomTextArea } from "../common/CustomFormFeilds";
import { openNotificationBox } from "../common/notification";

function AddEditGoalComponent({ editMode = false }) {
  const router = useRouter();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let data = {
      goal_title: "reqBody.goal_title",
      goal_description: "reqBody.goal_description",
      goal_type: "Individual",
      status: "OnTrack",
      progress: 0,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    };

    console.log(data);
    editMode ? updateGoalData(data) : addGoalsData(data);
  };

  const addGoalsData = async (data) => {
    setLoadingSubmitSpin(true);

    await httpService
      .post("/api/goals", data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/goals");
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setLoadingSubmitSpin(false);
      });
  };
  const updateGoalData = (data) => {};

  return (
    <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2">
      <Form form={form} name="goals" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="goal_title"
          rules={[
            {
              required: true,
              message: "Required!",
            },
            {
              validator: (_, value) => maxLengthValidator(value, 120),
            },
          ]}
        >
          <CustomInput placeholder="Goal Title" className=" h-12 rounded-md" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="goal_description"
          rules={[
            {
              required: true,
              message: "Required!",
            },
            {
              validator: (_, value) => maxLengthValidator(value, 400),
            },
          ]}
        >
          <CustomTextArea
            placeholder="Type here ...."
            className=" h-12 rounded-md"
          />
        </Form.Item>
        <Form.Item
          label="Goal Type"
          name="goal_type"
          rules={[
            {
              required: true,
              message: "Required!",
            },
          ]}
        >
          <Select placeholder="Select Goal Type" size="large">
            <Select.Option value="Organization">Organization</Select.Option>
            <Select.Option value="Team">Team</Select.Option>
            <Select.Option value="Individual">Individual</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Time"
          name="end_date"
          rules={[
            {
              required: true,
              message: "Required!",
            },
          ]}
        >
          <Select placeholder="Select Goal Scope" size="large">
            <Select.Option value="0">Day</Select.Option>
            <Select.Option value="1">Week</Select.Option>
            <Select.Option value="2"> Month</Select.Option>
            <Select.Option value="3">Six Month</Select.Option>
          </Select>
        </Form.Item>

        <PrimaryButton
          className="my-1 rounded"
          title={`Create`}
          type="submit"
        />
      </Form>{" "}
    </div>
  );
}

export default AddEditGoalComponent;

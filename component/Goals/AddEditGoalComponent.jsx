import { Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
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
    <Form form={form} name="goals" onFinish={onFinish}>
      <PrimaryButton className="my-1 rounded" title={`Create`} type="submit" />
    </Form>
  );
}

export default AddEditGoalComponent;

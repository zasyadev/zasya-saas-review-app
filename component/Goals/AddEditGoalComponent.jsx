import { Form, Select } from "antd";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import { CustomInput, CustomTextArea } from "../common/CustomFormFeilds";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";

const getDays = (number) => {
  switch (number) {
    case 0:
      return 1;
    case 1:
      return 7;
    case 2:
      return 30;
    case 3:
      return 180;

    default:
      return 0;
  }
};

function AddEditGoalComponent({ editMode = false }) {
  const router = useRouter();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    let data = {
      goal_title: values.goal_title,
      goal_description: values.goal_description,
      goal_type: values.goal_type,
      status: "OnTrack",
      progress: 0,
      start_date: new Date(),
      end_date: new Date(
        new Date().setDate(new Date().getDate() + getDays(values.end_date))
      ),
    };

    editMode
      ? updateGoalData({
          ...data,
          id: router.query.goal_id,
        })
      : addGoalsData(data);
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
  const updateGoalData = async (data) => {
    if (data.id) {
      setLoadingSubmitSpin(true);

      await httpService
        .put("/api/goals", data)
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
    }
  };

  const fetchGoalData = async () => {
    if (router.query.goal_id) {
      setLoading(true);
      await httpService
        .get(`/api/goals/${router.query.goal_id}`)
        .then(({ data: response }) => {
          if (response.status === 200) {
            form.setFieldsValue({
              goal_title: response.data.goal_title,
              goal_description: response.data.goal_description,
              goal_type: response.data.goal_type,
              end_date: response.data.end_date,
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (editMode) {
      fetchGoalData();
    }
  }, [editMode]);

  return loading ? (
    <div className="container mx-auto max-w-full">
      <PulseLoader />
    </div>
  ) : (
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
            <Select.Option value={0}>Day</Select.Option>
            <Select.Option value={1}>Week</Select.Option>
            <Select.Option value={2}> Month</Select.Option>
            <Select.Option value={3}>Six Month</Select.Option>
          </Select>
        </Form.Item>

        <PrimaryButton
          className="my-1 rounded"
          title={`${editMode ? "Update" : "Create"}`}
          type="submit"
          loading={loadingSubmitSpin}
        />
      </Form>
    </div>
  );
}

export default AddEditGoalComponent;

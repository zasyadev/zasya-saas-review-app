import { DatePicker, Form, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import { CustomInput, CustomTextArea } from "../common/CustomFormFeilds";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import {
  GOAL_TYPE,
  MONTHLY_FREQUENCY,
  ONCE_FREQUENCY,
  REVIEW_TYPE,
  WEEKLY_FREQUENCY,
} from "./constants";

function AddEditGoalComponent({ user, editMode = false }) {
  const router = useRouter();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    editMode
      ? updateGoalData({
          ...values,
          id: router.query.goal_id,
        })
      : addMeetingsData(values);
  };

  const addMeetingsData = async (data) => {
    setLoadingSubmitSpin(true);

    await httpService
      .post("/api/meetings", data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/meetings");
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

  const fetchGoalData = async () => {};

  useEffect(() => {
    if (editMode) {
      fetchGoalData();
    }
    fetchTeamData();
  }, [editMode]);

  async function fetchTeamData() {
    setTeamList([]);
    await httpService
      .get(`/api/teams`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setTeamList(response.data);
        }
      })
      .catch((err) => {
        setTeamList([]);
        console.error(err.response.data?.message);
      });
  }

  return loading ? (
    <div className="container mx-auto max-w-full">
      <PulseLoader />
    </div>
  ) : (
    <Form form={form} name="goals" layout="vertical" onFinish={onFinish}>
      <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2 md:px-8">
        <Form.Item
          label={`Title`}
          name="meeting_title"
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
          <CustomInput
            placeholder="Goal Title eg:weekly targets"
            className=" h-12 rounded-md"
          />
        </Form.Item>
        <Form.Item
          label={`Description`}
          name="meeting_description"
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
            className=" min-h-8 rounded-md"
          />
        </Form.Item>
      </div>
      <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2 md:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
          <Form.Item
            label="Meeting Type"
            name="meeting_type"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Select placeholder="Select Meeting Type" size="large">
              <Select.Option value={GOAL_TYPE}>Goal</Select.Option>
              <Select.Option value={REVIEW_TYPE}>Review</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Meeting Date"
            name="meeting_at"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          {/* <Form.Item
            label="Frequency"
            name="frequency"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Select
              placeholder="Select Goal Type"
              size="large"
              disabled={editMode}
            >
              <Select.Option value={ONCE_FREQUENCY}>Once</Select.Option>
              <Select.Option value={WEEKLY_FREQUENCY}>Weekly</Select.Option>
              <Select.Option value={MONTHLY_FREQUENCY}>Monthly</Select.Option>
            </Select>
          </Form.Item> */}
        </div>

        <div className="flex justify-end">
          <PrimaryButton
            className="my-1 rounded"
            title={`${editMode ? "Update" : "Create"}`}
            type="submit"
            loading={loadingSubmitSpin}
          />
        </div>
      </div>
    </Form>
  );
}

export default AddEditGoalComponent;

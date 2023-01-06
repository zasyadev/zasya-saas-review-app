import { DatePicker, Form, Select } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { disabledPreviousDates } from "../../helpers/dateHelper";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import { CustomInput, CustomTextArea } from "../common/CustomFormFeilds";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import { GOAL_TYPE, REVIEW_TYPE } from "./constants";

function AddEditGoalComponent({ user, editMode = false }) {
  const router = useRouter();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);

  const [form] = Form.useForm();

  const { meeting_id } = router.query;

  const onFinish = (values) => {
    editMode
      ? updateMeeting({
          ...values,
          id: meeting_id,
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
  const updateMeeting = async (data) => {
    if (data.id) {
      setLoadingSubmitSpin(true);

      await httpService
        .put("/api/meetings", data)
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
    }
  };

  async function fetchMeetingData() {
    setLoading(true);

    await httpService
      .get(`/api/meetings/${meeting_id}`)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.status === 200) {
          setMeetingData(response.data);
        }
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        );
        setLoading(false);
      });
  }

  const fillFormWithData = () => {
    form.setFieldsValue({
      meeting_at: moment(meetingData.meetingData),
      meeting_description: meetingData.meeting_description,
      meeting_title: meetingData.meeting_title,
      meeting_type: meetingData.meeting_type,
    });
  };

  useEffect(() => {
    if (editMode && meeting_id) {
      fetchMeetingData();
    }
  }, [editMode, meeting_id]);

  useEffect(() => {
    if (meetingData) {
      fillFormWithData();
    }
  }, [meetingData]);

  return loading ? (
    <div className="container mx-auto max-w-full">
      <PulseLoader />
    </div>
  ) : meetingData ? (
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
            placeholder="Meeting Title"
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
            <Select
              placeholder="Select Meeting Type"
              size="large"
              className="font-medium"
            >
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
            <DatePicker
              size="large"
              className="rounded-md"
              disabledDate={disabledPreviousDates}
            />
          </Form.Item>
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
  ) : (
    <NoRecordFound title={"No Meeting Found"} />
  );
}

export default AddEditGoalComponent;

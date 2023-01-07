import { DatePicker, Form, Select } from "antd";
import React from "react";
import { disabledPreviousDates } from "../../../helpers/dateHelper";
import { PrimaryButton } from "../../common/CustomButton";
import { CustomInput, CustomTextArea } from "../../common/CustomFormFeilds";
import { GOAL_TYPE, REVIEW_TYPE } from "../constants";
import { maxLengthValidator } from "../../../helpers/formValidations";

function MeetingForm({
  form,
  onFinish,
  setMeetingType,
  meetingType,
  loadingSubmitSpin,
  editMode,
  reviewsList,
  goalsList,
  disabledTypeField = false,
}) {
  return (
    <Form form={form} name="meeting" layout="vertical" onFinish={onFinish}>
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
              onSelect={(value) => {
                setMeetingType(value);
                form.setFieldsValue({ type_id: null });
              }}
              disabled={disabledTypeField}
            >
              <Select.Option value={GOAL_TYPE}>Goal</Select.Option>
              <Select.Option value={REVIEW_TYPE}>Review</Select.Option>
            </Select>
          </Form.Item>
          {[GOAL_TYPE, REVIEW_TYPE].includes(meetingType) && (
            <Form.Item
              name="type_id"
              label={`Select ${meetingType}`}
              rules={[
                {
                  required: true,
                  message: "required",
                },
              ]}
            >
              <Select
                size="large"
                placeholder={`Select ${meetingType}`}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {meetingType === REVIEW_TYPE
                  ? reviewsList.map((data, index) => (
                      <Select.Option key={index} value={data.id}>
                        {data?.review_name}
                      </Select.Option>
                    ))
                  : goalsList.map((data, index) => (
                      <Select.Option key={index} value={data.goal_id}>
                        {data?.goal?.goal_title}
                      </Select.Option>
                    ))}
              </Select>
            </Form.Item>
          )}

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
  );
}

export default MeetingForm;

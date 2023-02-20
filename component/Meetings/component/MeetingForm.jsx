import { DatePicker, Form, Select } from "antd";
import React from "react";
import {
  DEFAULT_DATETIME_FORMAT,
  disabledPreviousDates,
} from "../../../helpers/dateHelper";
import { PrimaryButton } from "../../common/CustomButton";
import { CustomInput, CustomTextArea } from "../../common/CustomFormFeilds";
import { CASUAL_TYPE, GOAL_TYPE, REVIEW_TYPE } from "../constants";
import { maxLengthValidator } from "../../../helpers/formValidations";
import moment from "moment";

function MeetingForm({
  form,
  onFinish,
  setMeetingType,
  meetingType,
  loadingSubmitSpin,
  reviewsList,
  goalsList,
  userList,
  disabledTypeField = false,
  editMode = false,
  onValuesChange,
}) {
  function onSelect(value) {
    form.setFieldsValue({
      meeting_at: value,
    });
  }
  return (
    <Form
      form={form}
      name="meeting"
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
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
            className="h-12 rounded-md"
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
                form.setFieldsValue({ type_id: [] });
              }}
              disabled={disabledTypeField}
            >
              <Select.Option value={GOAL_TYPE}>Goal</Select.Option>
              <Select.Option value={REVIEW_TYPE}>Review</Select.Option>
              <Select.Option value={CASUAL_TYPE}>Casual</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="members"
            label="Members "
            rules={[
              {
                required: true,
                message: "Please select your Members",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Member"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              size="large"
              className="w-full"
              maxTagCount="responsive"
              // disabled={disabledTypeField}
            >
              {userList?.length > 0 &&
                userList?.map((data, index) => (
                  <Select.Option key={index + "users"} value={data?.user?.id}>
                    {data?.user?.first_name}
                  </Select.Option>
                ))}
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
                mode="multiple"
                size="large"
                placeholder={`Select ${meetingType}`}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                // disabled={editMode}
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
              className="rounded-md w-full"
              disabledDate={disabledPreviousDates}
              showTime={{
                format: "HH:mm",
              }}
              onSelect={onSelect}
              format={DEFAULT_DATETIME_FORMAT}
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

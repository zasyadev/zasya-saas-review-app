import { Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import {
  ABANDONED_STATUS,
  COMPLETED_STATUS,
  DELAYED_STATUS,
  ONTRACK_STATUS,
} from "./constants";

function GoalStatusModal({
  editGoalModalVisible,
  hideEditGoalModal,
  goalEditHandle,
  loading,
}) {
  const { defaultValue, goal_title, visible, goal_id, id } =
    editGoalModalVisible;
  const [statusForm] = Form.useForm();
  useEffect(() => {
    statusForm.setFieldValue({
      status: defaultValue,
    });
    return () => {
      statusForm.resetFields();
    };
  }, []);

  return (
    <CustomModal
      title={
        <p className="single-line-clamp mb-0 pr-6 break-all">{goal_title}</p>
      }
      visible={visible}
      onCancel={() => hideEditGoalModal()}
      customFooter
      footer={[
        <>
          <SecondaryButton
            onClick={() => hideEditGoalModal()}
            className="h-full mr-2"
            title="Cancel"
          />
          <PrimaryButton
            onClick={() => statusForm.submit()}
            className="h-full"
            title="Update"
            disabled={loading}
            loading={loading}
          />
        </>,
      ]}
    >
      <Form
        layout="vertical"
        form={statusForm}
        initialValues={{
          status: defaultValue,
        }}
        onFinish={(value) =>
          goalEditHandle({
            goal_id: goal_id,
            id: id,
            value: value,
            type: "forStatus",
          })
        }
      >
        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value={ONTRACK_STATUS}>On Track</Select.Option>
            <Select.Option value={COMPLETED_STATUS}>Completed</Select.Option>
            <Select.Option value={DELAYED_STATUS}>Delayed</Select.Option>
            <Select.Option value={ABANDONED_STATUS}>Abandoned</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="comment" label="Comment">
          <Input
            className="h-12 rounded-md"
            placeholder="Comment about the status"
          />
        </Form.Item>
      </Form>
    </CustomModal>
  );
}

export default GoalStatusModal;

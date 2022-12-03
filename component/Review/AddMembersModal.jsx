import { Form, Select } from "antd";
import React, { useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";

const AddMembersModal = ({
  allTeamMembers,
  review_name,
  isVisible,
  review_id,
  reviewAssignee,
  hideReviewAddMemberModal,
  fetchReviewAssignList,
  userId,
}) => {
  const [addMembersForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const unassignedMembers =
    Number(allTeamMembers?.length) > 0
      ? allTeamMembers.filter((member) => {
          if (Number(reviewAssignee?.length) > 0) {
            return !Boolean(
              reviewAssignee.find(
                (assignee) => assignee.assigned_to_id === member.user_id
              )
            );
          } else return member;
        })
      : [];

  const onFinish = async (values) => {
    if (review_id && Number(values?.assignedIds?.length) > 0) {
      setLoading(true);
      await httpService
        .post(`/api/review/add_members`, {
          reviewId: review_id,
          assignedIds: values?.assignedIds,
          userId: userId,
        })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchReviewAssignList();
            hideReviewAddMemberModal();
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  };

  return (
    <CustomModal
      title={<p className="single-line-clamp mb-0 pr-6">{review_name}</p>}
      visible={isVisible}
      onCancel={() => hideReviewAddMemberModal()}
      customFooter
      footer={[
        <>
          <SecondaryButton
            onClick={() => hideReviewAddMemberModal()}
            className=" h-full mr-2"
            title="Cancel"
            disabled={loading}
          />
          <PrimaryButton
            onClick={() => addMembersForm.submit()}
            className=" h-full  "
            title="Add  Member(s)"
            disabled={loading}
            loading={loading}
          />
        </>,
      ]}
      modalProps={{ wrapClassName: "add_members_form_modal" }}
    >
      <div>
        <Form layout="vertical" form={addMembersForm} onFinish={onFinish}>
          <p className="text-base font-bold mb-2 text-primary">
            Please select your feedback members
          </p>
          <Form.Item
            name="assignedIds"
            className="mb-0 margin-b-0"
            rules={[
              {
                required: true,
                message: "Please select at least one member!",
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
              className="w-full select-tag"
              maxTagCount="responsive"
            >
              {unassignedMembers.length > 0 && (
                <>
                  {unassignedMembers.map((data, index) => (
                    <Select.Option key={index + "users"} value={data?.user?.id}>
                      {data?.user?.first_name}
                    </Select.Option>
                  ))}
                </>
              )}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </CustomModal>
  );
};

export default AddMembersModal;

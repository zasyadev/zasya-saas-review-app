import { Form, Input } from "antd";
import React, { useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import { openNotificationBox } from "../common/notification";

function MeetingCommentModal({
  meetingModalData,
  hideMeetingModal,
  fetchMeetingData,
}) {
  const [meetingForm] = Form.useForm();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);

  const onFinishUpdatingComment = async (values) => {
    const obj = {
      comment: values.comment,
      assigneeId: meetingModalData.assigneeId,
    };

    setLoadingSubmitSpin(true);
    await httpService
      .post(`/api/meetings/${meetingModalData.meetingId}`, obj)
      .then(({ data: response }) => {
        openNotificationBox("success", response.message, 3);
        hideMeetingModal();
        fetchMeetingData();
      })
      .catch((err) => openNotificationBox("error", err.response.data?.message))
      .finally(() => setLoadingSubmitSpin(false));
  };

  return (
    <CustomModal
      title={
        <p className="single-line-clamp mb-0 pr-6 break-all">
          {meetingModalData?.meetingTitle}
        </p>
      }
      visible={meetingModalData?.isVisible}
      onCancel={() => hideMeetingModal()}
      customFooter
      footer={[
        <>
          <SecondaryButton
            onClick={() => hideMeetingModal()}
            className=" h-full mr-2"
            title="Cancel"
          />
          <PrimaryButton
            onClick={() => meetingForm.submit()}
            className=" h-full  "
            title="Submit"
            disabled={loadingSubmitSpin}
            loading={loadingSubmitSpin}
          />
        </>,
      ]}
      modalProps={{ wrapClassName: "view_form_modal" }}
    >
      <Form
        layout="vertical"
        form={meetingForm}
        onFinish={onFinishUpdatingComment}
      >
        <Form.Item name="comment" label="Comment">
          <Input.TextArea
            rows={3}
            className="rounded-md"
            placeholder="Add your thoughts abouts the follow up meetings"
          />
        </Form.Item>
      </Form>
    </CustomModal>
  );
}

export default MeetingCommentModal;

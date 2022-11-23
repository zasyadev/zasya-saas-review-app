import { Tabs } from "antd";
import React from "react";
import CustomModal from "../common/CustomModal";
import DefaultImages from "../common/DefaultImages";

const ReviewAssignessModal = ({
  reviewCountModalData,
  hideReviewCountModal,
}) => {
  const tabItems = [
    {
      label: "All Assignees",
      key: "All",
      children: (
        <GetAssigneesList
          type={"ALL"}
          reviewAssignee={reviewCountModalData?.ReviewAssignee}
        />
      ),
    },
    {
      label: "Submitted",
      key: "Submitted",
      children: (
        <GetAssigneesList
          type={"answered"}
          reviewAssignee={reviewCountModalData?.ReviewAssignee}
        />
      ),
    },
    {
      label: "Pending",
      key: "Pending",
      children: (
        <GetAssigneesList
          type={null}
          reviewAssignee={reviewCountModalData?.ReviewAssignee}
        />
      ),
    },
  ];

  return (
    <CustomModal
      title={
        <div className="single-line-clamp mb-0 pr-6">
          {reviewCountModalData?.review_name}
        </div>
      }
      visible={reviewCountModalData?.isVisible}
      onCancel={() => hideReviewCountModal()}
      customFooter
      footer={null}
      modalProps={{ wrapClassName: "view_form_modal" }}
    >
      <div>
        <Tabs
          defaultActiveKey="All"
          className="font-semibold"
          items={tabItems}
        />{" "}
      </div>
    </CustomModal>
  );
};

const GetAssigneesList = ({ type, reviewAssignee }) => {
  if (Number(reviewAssignee?.length) === 0) return null;

  const filteredAssigneeList =
    type === "ALL"
      ? reviewAssignee
      : reviewAssignee.filter((assignee) => assignee.status === type);

  return (
    <div className="divide-y space-y-1">
      {filteredAssigneeList.length > 0 ? (
        filteredAssigneeList.map((assignee) => (
          <div className="flex items-center gap-4 p-2" key={assignee.id}>
            <div className="shrink-0">
              <DefaultImages
                imageSrc={assignee?.assigned_to?.UserDetails?.image}
                width={40}
                height={40}
              />
            </div>

            <div className="flex-1">
              <p className="mb-0 text-primary font-medium text-base">
                {assignee?.assigned_to?.first_name}
              </p>
              <p className="text-gray-400 font-medium text-sm mb-0">
                {assignee?.assigned_to?.email}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="mb-0 p-2 text-gray-400 font-medium text-sm">
          No assignees
        </p>
      )}
    </div>
  );
};

export default ReviewAssignessModal;

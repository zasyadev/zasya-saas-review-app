import React from "react";
import CustomModal from "../common/CustomModal";
import DefaultImages from "../common/DefaultImages";

const GoalAssignessModal = ({
  goalAssigneeModalData,
  hideAssigneeModal,
  userId,
}) => {
  return (
    <CustomModal
      title={
        <p className="single-line-clamp mb-0 pr-6 break-all">
          {goalAssigneeModalData?.goal_title}
        </p>
      }
      visible={goalAssigneeModalData?.isVisible}
      onCancel={() => hideAssigneeModal()}
      customFooter
      footer={null}
      modalProps={{ wrapClassName: "view_form_modal" }}
    >
      <GetAssigneesList
        GoalAssignee={goalAssigneeModalData?.GoalAssignee}
        userId={userId}
      />
    </CustomModal>
  );
};

const GetAssigneesList = ({ userId, GoalAssignee }) => {
  if (Number(GoalAssignee?.length) === 0) return null;

  return (
    <div className="divide-y space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
      {GoalAssignee.length > 0 ? (
        GoalAssignee.map(
          (assignee) =>
            userId !== assignee.assignee_id && (
              <div className="flex items-center gap-4 p-2" key={assignee.id}>
                <div className="shrink-0">
                  <DefaultImages
                    imageSrc={assignee?.assignee?.UserDetails?.image}
                    width={40}
                    height={40}
                  />
                </div>

                <div className="flex-1">
                  <p className="mb-0 text-primary font-medium text-base">
                    {assignee?.assignee?.first_name}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="mb-0 text-primary font-medium text-base">
                    {assignee?.status}
                  </p>
                </div>
              </div>
            )
        )
      ) : (
        <p className="mb-0 p-2 text-gray-400 font-medium text-sm">
          No assignees
        </p>
      )}
    </div>
  );
};

export default GoalAssignessModal;

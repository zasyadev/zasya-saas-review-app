import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input, Select, Tag } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { DEFAULT_DATE_FORMAT } from "../../../helpers/dateHelper";
import httpService from "../../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../../common/CustomButton";
import CustomModal from "../../common/CustomModal";
import NoRecordFound from "../../common/NoRecordFound";
import GoalAssignessModal from "../GoalAssignessModal";

const initialModalVisible = {
  visible: false,
  id: "",
  goal_title: "",
  defaultValue: "",
  goal_id: "",
};

const initialGoalCountModalData = {
  goal_title: "",
  GoalAssignee: [],
  isVisible: false,
};

const GroupListBox = ({ goalsList, type, title, userId, fetchGoalList }) => {
  const [updateGoalForm] = Form.useForm();
  const [editGoalModalVisible, setEditGoalModalVisible] =
    useState(initialModalVisible);

  const [goalAssigneeModalData, setGoalAssigneeModalData] = useState(
    initialGoalCountModalData
  );
  const [loading, setLoading] = useState(false);

  const filteredGoalList = useMemo(
    () =>
      goalsList?.length
        ? goalsList.filter((item) => item?.goal?.frequency === type)
        : [],

    [goalsList?.length]
  );

  const ShowAssigneeModal = ({ goal_title, GoalAssignee }) => {
    setGoalAssigneeModalData({
      goal_title,
      GoalAssignee,
      isVisible: true,
    });
  };

  const hideAssigneeModal = () => {
    setGoalAssigneeModalData(initialGoalCountModalData);
  };

  const statusPill = (key) => {
    switch (key) {
      case "Completed":
        return <Tag color="success">Completed</Tag>;
      case "OnTrack":
        return <Tag color="processing">OnTrack</Tag>;
      case "Delayed":
        return <Tag color="warning">Delayed</Tag>;
      case "AtRisk":
        return <Tag color="error">AtRisk</Tag>;
      case "Abandoned":
        return <Tag color="default">Abandoned</Tag>;

      default:
        break;
    }
  };

  const goalEditHandle = async ({ goal_id, id, value, type }) => {
    setLoading(true);
    await httpService
      .put(`/api/goals/${goal_id}`, {
        value,
        type,
        id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          fetchGoalList();
          setEditGoalModalVisible(initialModalVisible);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className=" bg-white rounded-md pb-3">
      <div className="p-4 font-bold text-lg capitalize ">{title}</div>
      <div className="divide-y space-y-3 max-h-screen overflow-y-auto custom-scrollbar px-2">
        {Number(filteredGoalList.length > 0) ? (
          filteredGoalList.map((item) => (
            <div className="py-4 bg-gray-50 border border-gray-100 shadow-sm rounded-md ">
              <div className=" px-4 space-y-2">
                {item.goal.created_by === userId ? (
                  <Link href={`/goals/${item.goal.id}/detail`} passHref>
                    <p className="cursor-pointer text-gray-500 mb-0 text-base font-medium two-line-clamp">
                      {item.goal.goal_title}
                    </p>
                  </Link>
                ) : (
                  <p className="text-base font-medium two-line-clamp">
                    {item.goal.goal_title}
                  </p>
                )}

                <div className="flex justify-between ">
                  <div className="flex items-center gap-2 font-medium">
                    <p className="flex mb-0">{item.goal.goal_type}</p>
                    {item.goal.goal_type === "Individual" &&
                      item.goal.created_by === userId && (
                        <InfoCircleOutlined
                          className="text-gray-600 cursor-pointer select-none"
                          onClick={() =>
                            ShowAssigneeModal({
                              goal_title: item.goal.goal_title,
                              GoalAssignee: item.goal.GoalAssignee,
                            })
                          }
                        />
                      )}
                  </div>

                  <p
                    className="text-sm cursor-pointer"
                    onClick={() => {
                      if (
                        (!item.goal.is_archived &&
                          item.goal.created_by === userId) ||
                        item.assignee_id === userId
                      ) {
                        setEditGoalModalVisible({
                          visible: true,
                          id: item.id,
                          goal_title: item.goal.goal_title,
                          defaultValue: item.status,
                          goal_id: item.goal.id,
                        });
                        updateGoalForm.resetFields();
                      }
                    }}
                  >
                    {statusPill(item.status)}
                  </p>
                </div>
                <p className="text-right text-xs font-medium">
                  Ends On:{" "}
                  {moment(item?.goal.end_date).format(DEFAULT_DATE_FORMAT)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoRecordFound title={"No Goals Found"} />
        )}
      </div>

      {goalAssigneeModalData?.isVisible && (
        <GoalAssignessModal
          goalAssigneeModalData={goalAssigneeModalData}
          hideAssigneeModal={hideAssigneeModal}
          userId={userId}
        />
      )}
      <CustomModal
        title={
          <p className="single-line-clamp mb-0 pr-6">
            {editGoalModalVisible.goal_title}
          </p>
        }
        visible={editGoalModalVisible.visible}
        onCancel={() => setEditGoalModalVisible(initialModalVisible)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setEditGoalModalVisible(initialModalVisible)}
              className=" h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => updateGoalForm.submit()}
              className=" h-full  "
              title="Update"
              disabled={loading}
              loading={loading}
            />
          </>,
        ]}
      >
        <div>
          <Form
            layout="vertical"
            form={updateGoalForm}
            onFinish={(value) =>
              goalEditHandle({
                goal_id: editGoalModalVisible.goal_id,
                id: editGoalModalVisible.id,
                value: value,
                type: "forStatus",
              })
            }
            initialValues={{
              status: editGoalModalVisible.defaultValue,
            }}
          >
            <Form.Item name="status" label="Status">
              <Select value={editGoalModalVisible.defaultValue}>
                <Select.Option value="OnTrack">On Track</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Delayed">Delayed</Select.Option>
                <Select.Option value="Abandoned">Abandoned</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="comment" label="Comment">
              <Input />
            </Form.Item>
          </Form>
        </div>
      </CustomModal>
    </div>
  );
};

function GoalGroupComponent({ goalsList, userId, fetchGoalList }) {
  const defaultProps = {
    goalsList: goalsList,
    userId: userId,
    fetchGoalList: fetchGoalList,
  };
  const groupItems = [
    {
      label: "Day",
      key: "day",
      children: <GroupListBox type={"daily"} title={"Day"} {...defaultProps} />,
    },
    {
      label: "Week",
      key: "week",
      children: (
        <GroupListBox type={"weekly"} title={"Week"} {...defaultProps} />
      ),
    },
    {
      label: "Month",
      key: "month",
      children: (
        <GroupListBox type={"monthly"} title={"Month"} {...defaultProps} />
      ),
    },
    {
      label: "Half Year",
      key: "halfyear",
      children: (
        <GroupListBox
          type={"halfyearly"}
          title={"Half Year"}
          {...defaultProps}
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {groupItems.map((groupItems) => {
        return <>{groupItems.children}</>;
      })}
    </div>
  );
}

export default GoalGroupComponent;

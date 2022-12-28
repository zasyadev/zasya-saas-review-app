import {
  BankOutlined,
  InfoCircleOutlined,
  EllipsisOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Dropdown, Form, Input, Menu, Popconfirm, Popover, Select } from "antd";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import httpService from "../../../../lib/httpService";
import {
  ButtonGray,
  PrimaryButton,
  SecondaryButton,
} from "../../../common/CustomButton";
import CustomModal from "../../../common/CustomModal";
import NoRecordFound from "../../../common/NoRecordFound";
import { statusPill } from "../../constants";
import GoalAssignessModal from "../../GoalAssignessModal";
import DateInfoCard from "./components/DateInfoCard";

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

const GoalsGroupList = ({
  goalsList,
  type,
  title,
  userId,
  fetchGoalList,
  isArchived,
}) => {
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

    [goalsList, type]
  );

  const goalsProgressPercent = useMemo(() => {
    if (filteredGoalList.length === 0) return 0;
    const pendingGoals = filteredGoalList.filter(
      (item) => item?.status === "Completed"
    );
    const percent = Math.abs(
      Number(pendingGoals?.length / filteredGoalList?.length) * 100
    );
    return percent;
  }, [filteredGoalList]);

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
          fetchGoalList("All");
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
      <div className=" items-center p-4 font-bold text-lg capitalize">
        <p className="mb-2">{title}</p>
        {!isArchived && (
          <div className=" flex-1 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-600 h-1.5 rounded-full"
              style={{ width: `${goalsProgressPercent}%` }}
              title={Number(goalsProgressPercent).toFixed(2) + "%"}
            ></div>
          </div>
        )}
      </div>
      <div className="divide-y space-y-3 max-h-screen overflow-y-auto custom-scrollbar px-2">
        {Number(filteredGoalList.length > 0) ? (
          filteredGoalList.map((item) => (
            <div
              className="py-4 bg-gray-50 border border-gray-100 shadow-sm rounded-md "
              key={item.id}
            >
              <div className=" px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/goals/${item.goal.id}/${
                      isArchived ? "archived" : "detail"
                    }`}
                    passHref
                  >
                    <p className="cursor-pointer text-gray-800 mb-0 text-base font-medium two-line-clamp">
                      {item.goal.goal_title}
                    </p>
                  </Link>

                  {item.goal.created_by === userId && (
                    <Dropdown
                      trigger={"click"}
                      overlay={
                        <Menu className="divide-y">
                          {!isArchived && (
                            <Menu.Item
                              className="font-semibold"
                              key={"call-preview"}
                            >
                              <Link href={`/goals/${item.goal.id}/edit`}>
                                Edit
                              </Link>
                            </Menu.Item>
                          )}

                          <Menu.Item
                            className="text-gray-600 font-semibold"
                            key={"call-Archived"}
                            onClick={() =>
                              goalEditHandle({
                                goal_id: item.goal.id,
                                id: item.id,
                                value: item.goal.is_archived ? false : true,
                                type: "forArchived",
                              })
                            }
                          >
                            {item.goal.is_archived ? "UnArchived" : "Archived"}
                          </Menu.Item>
                          {isArchived && (
                            <Menu.Item
                              className="text-red-600 font-semibold"
                              key={"call-delete"}
                            >
                              <Popconfirm
                                title={`Are you sure to delete ${item.goal.goal_title} ？`}
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() =>
                                  goalEditHandle({
                                    goal_id: item.goal.id,
                                    id: item.id,
                                    value: item.goal.is_archived ? false : true,
                                    type: "forDelete",
                                  })
                                }
                                icon={false}
                              >
                                Delete
                              </Popconfirm>
                            </Menu.Item>
                          )}
                        </Menu>
                      }
                      placement="bottomRight"
                    >
                      <ButtonGray
                        className="grid place-content-center w-6 h-6 p-0"
                        rounded="rounded-full"
                        title={
                          <EllipsisOutlined
                            rotate={90}
                            className="text-base leading-0"
                          />
                        }
                      />
                    </Dropdown>
                  )}
                </div>

                <div className="flex justify-between ">
                  <div className="flex items-center gap-2 flex-wrap font-medium">
                    <Popover
                      placement="topLeft"
                      title={"Created by"}
                      content={
                        <>
                          <span className="font-medium">
                            {item?.goal?.created.first_name} (
                            {item.goal.goal_type})
                          </span>
                        </>
                      }
                      trigger={["click", "hover"]}
                    >
                      {item.goal.goal_type === "Individual" && (
                        <TeamOutlined className="text-base leading-0" />
                      )}
                      {item.goal.goal_type === "Self" && (
                        <UserOutlined className="text-base leading-0" />
                      )}

                      {item.goal.goal_type === "Organization" && (
                        <BankOutlined className="text-base leading-0" />
                      )}
                    </Popover>
                    {/* {item.goal.goal_type === "Individual" &&
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
                      )} */}
                  </div>

                  <p
                    className="text-sm cursor-pointer"
                    onClick={() => {
                      if (
                        ((!item.goal.is_archived &&
                          item.goal.created_by === userId) ||
                          item.assignee_id === userId) &&
                        !isArchived
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
                    <span
                      className={`text-xs font-semibold px-2 py-1 uppercase rounded-md ${statusPill(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>

                <DateInfoCard endDate={item?.goal.end_date} />
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

export default GoalsGroupList;

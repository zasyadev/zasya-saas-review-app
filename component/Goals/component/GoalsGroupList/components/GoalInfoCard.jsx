import {
  BankOutlined,
  EllipsisOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Popconfirm, Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { ButtonGray } from "../../../../common/CustomButton";
import {
  INDIVIDUAL_TYPE,
  ORGANIZATION_TYPE,
  SELF_TYPE,
  statusPill,
} from "../../../constants";
import DateInfoCard from "./DateInfoCard";

function GoalInfoCard({
  item,
  isArchived,
  userId,
  updateGoalForm,
  goalEditHandle,
  setEditGoalModalVisible,
}) {
  return (
    <div className="py-4 bg-gray-50 border border-gray-100 shadow-sm rounded-md ">
      <div className="px-4 space-y-4">
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
                    <Menu.Item className="font-semibold" key={"call-preview"}>
                      <Link href={`/goals/${item.goal.id}/edit`}>Edit</Link>
                    </Menu.Item>
                  )}

                  <Menu.Item
                    className="text-gray-400 font-semibold"
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
            <Tooltip
              placement="topLeft"
              className="text-xs"
              overlayClassName="text-xs"
              title={item.goal.goal_type}
            >
              {item.goal.goal_type === INDIVIDUAL_TYPE && (
                <TeamOutlined className="text-base leading-0" />
              )}
              {item.goal.goal_type === SELF_TYPE && (
                <UserOutlined className="text-base leading-0" />
              )}

              {item.goal.goal_type === ORGANIZATION_TYPE && (
                <BankOutlined className="text-base leading-0" />
              )}
            </Tooltip>
            <span className="font-medium">
              {item?.goal?.created_by === userId
                ? "You"
                : item?.goal?.created.first_name}
            </span>

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
                ((!item.goal.is_archived && item.goal.created_by === userId) ||
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
  );
}

export default GoalInfoCard;

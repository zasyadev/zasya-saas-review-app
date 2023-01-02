import {
  BankOutlined,
  EllipsisOutlined,
  TeamOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { ButtonGray } from "../../common/CustomButton";
import CustomTable from "../../common/CustomTable";
import {
  INDIVIDUAL_TYPE,
  ORGANIZATION_TYPE,
  SELF_TYPE,
  statusPill,
  TEAM_TYPE,
} from "../constants";
import { getAssigneeName } from "../helper";
import DateInfoCard from "./GoalsGroupList/components/DateInfoCard";

function GoalsCustomTable({
  sortListByEndDate,
  setEditGoalModalVisible,
  updateGoalForm,
  goalEditHandle,
  userId,
  isArchived,
  ShowAssigneeModal,
}) {
  const columns = [
    {
      title: "Goal Name",
      key: "goal_title",
      render: (_, record) => (
        <Link href={`/goals/${record.goal.id}/detail`} passHref>
          <p className="cursor-pointer text-gray-500 mb-0">
            {record.goal.goal_title}
          </p>
        </Link>
      ),
    },
    {
      title: "Type",
      key: "goal_type",
      render: (_, record) => (
        <div className="flex items-center gap-2 flex-wrap font-medium">
          <Tooltip
            placement="topLeft"
            className="text-xs"
            overlayClassName="text-xs"
            title={record.goal.goal_type}
          >
            {record.goal.goal_type === INDIVIDUAL_TYPE && (
              <TeamOutlined className="text-base leading-0" />
            )}
            {record.goal.goal_type === SELF_TYPE && (
              <UserOutlined className="text-base leading-0" />
            )}
            {record.goal.goal_type === TEAM_TYPE && (
              <TeamOutlined className="text-base leading-0" />
            )}

            {record.goal.goal_type === ORGANIZATION_TYPE && (
              <BankOutlined className="text-base leading-0" />
            )}
          </Tooltip>
          <span className="font-medium">
            {record?.goal?.created_by === userId ? (
              record?.goal?.goal_type === INDIVIDUAL_TYPE ? (
                Number(record?.goal?.GoalAssignee?.length) === 2 ? (
                  getAssigneeName(record.goal)
                ) : (
                  <>
                    You{" "}
                    <InfoCircleOutlined
                      className="text-gray-600 cursor-pointer select-none"
                      onClick={() =>
                        ShowAssigneeModal({
                          goal_title: record.goal.goal_title,
                          GoalAssignee: record.goal.GoalAssignee,
                        })
                      }
                    />
                  </>
                )
              ) : (
                "You"
              )
            ) : (
              record?.goal?.created.first_name
            )}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",

      render: (_, record) => (
        <p
          className="text-sm cursor-pointer"
          onClick={() => {
            if (
              ((!record.goal.is_archived &&
                record.goal.created_by === userId) ||
                record.assignee_id === userId) &&
              !isArchived
            ) {
              setEditGoalModalVisible({
                visible: true,
                id: record.id,
                goal_title: record.goal.goal_title,
                defaultValue: record.status,
                goal_id: record.goal.id,
              });
              updateGoalForm.resetFields();
            }
          }}
        >
          <span
            className={`text-xs font-semibold px-2 py-1 uppercase rounded-md ${statusPill(
              record.status
            )}`}
          >
            {record.status}
          </span>
        </p>
      ),
    },
    {
      title: "End Date",
      key: "end_date",
      render: (_, record) => <DateInfoCard endDate={record?.goal.end_date} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.goal.created_by === userId && (
          <Dropdown
            trigger={"click"}
            overlay={
              <Menu className="divide-y">
                <Menu.Item className="font-semibold" key={"call-preview"}>
                  <Link href={`/goals/${record.goal.id}/edit`}>Edit</Link>
                </Menu.Item>

                <Menu.Item
                  className="text-gray-400 font-semibold"
                  key={"call-Archived"}
                  onClick={() =>
                    goalEditHandle({
                      goal_id: record.goal.id,
                      id: record.id,
                      value: record.goal.is_archived ? false : true,
                      type: "forArchived",
                    })
                  }
                >
                  {record.goal.is_archived ? "UnArchived" : "Archived"}
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <ButtonGray
              className="grid place-content-center w-8 h-8"
              rounded="rounded-full"
              title={
                <EllipsisOutlined rotate={90} className="text-lg leading-0" />
              }
            />
          </Dropdown>
        ),
    },
  ];
  return (
    <CustomTable
      dataSource={sortListByEndDate}
      columns={columns}
      className="custom-table"
      showHeader={false}
      isPagination={false}
    />
  );
}

export default GoalsCustomTable;

import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import Link from "next/link";
import React from "react";
import { ButtonGray } from "../../common/CustomButton";
import CustomTable from "../../common/CustomTable";
import { statusPill } from "../constants";
import { GoalAssigneeName } from "./GoalAssigneeName";
import DateInfoCard from "./GoalsGroupList/components/DateInfoCard";

function GoalsCustomTable({
  goalList,
  setEditGoalModalVisible,
  updateGoalForm,
  goalEditHandle,
  userId,
  isArchived,
  ShowAssigneeModal,
  showHeader = false,
  isPagination = false,
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
      title: "Assignee",
      key: "goal_assignee",
      render: (_, record) => (
        <GoalAssigneeName
          record={record}
          userId={userId}
          ShowAssigneeModal={ShowAssigneeModal}
        />
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
      title: <p className="mb-0 text-center">End Date</p>,
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
      dataSource={goalList}
      columns={columns}
      className="custom-table rounded-md"
      showHeader={showHeader}
      isPagination={isPagination}
    />
  );
}

export default GoalsCustomTable;

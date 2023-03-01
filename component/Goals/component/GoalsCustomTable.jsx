import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Popconfirm } from "antd";
import Link from "next/link";
import React from "react";
import { URLS } from "../../../constants/urls";
import CustomAvatar from "../../common/CustomAvatar";
import { ButtonGray } from "../../common/CustomButton";
import CustomTable from "../../common/CustomTable";
import { statusPill } from "../constants";
import { GoalAssigneeName } from "./GoalAssigneeName";
import DateInfoCard from "./GoalsGroupList/components/DateInfoCard";

function GoalsCustomTable({
  goalList,
  ShowEditGoalModal,
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
        <Link href={`${URLS.GOAL}/${record.goal.id}/detail`} passHref>
          <p className="cursor-pointer text-gray-500 mb-0 underline px-3">
            {record.goal.goal_title}
          </p>
        </Link>
      ),
    },

    {
      title: <p className="mb-0 text-center">End Date</p>,
      key: "end_date",
      render: (_, record) => <DateInfoCard endDate={record?.goal.end_date} />,
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
              ShowEditGoalModal({
                record: record,
              });
            }
          }}
        >
          <span
            className={`text-xs font-medium px-3 py-2 uppercase rounded-md ${statusPill(
              record.status
            )}`}
          >
            {record.status}
          </span>
        </p>
      ),
    },
    {
      title: "Assignee",
      key: "goal_assignee",
      render: (_, record) => (
        // <GoalAssigneeName
        //   record={record}
        //   userId={userId}
        //   ShowAssigneeModal={ShowAssigneeModal}
        // />
        <CustomAvatar
          userList={record?.goal?.GoalAssignee}
          avatarCount={2}
          className="w-8 h-8 text-sm"
        />
      ),
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
                  <Link href={`${URLS.GOAL}/${record.goal.id}/edit`}>Edit</Link>
                </Menu.Item>

                <Menu.Item
                  className="text-gray-400 font-semibold"
                  key={"call-Archived"}
                >
                  <Popconfirm
                    title={`Are you sure to ${
                      record.goal.is_archived ? "unarchived" : "archived"
                    } ${record.goal.goal_title} ？`}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() =>
                      goalEditHandle({
                        goal_id: record.goal.id,
                        id: record.id,
                        value: record.goal.is_archived ? false : true,
                        type: "forArchived",
                      })
                    }
                    icon={false}
                  >
                    {record.goal.is_archived ? "UnArchived" : "Archived"}
                  </Popconfirm>
                </Menu.Item>

                {isArchived && (
                  <Menu.Item
                    className="text-red-600 font-semibold"
                    key={"call-delete"}
                  >
                    <Popconfirm
                      title={`Are you sure to delete ${record.goal.goal_title} ？`}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() =>
                        goalEditHandle({
                          goal_id: record.goal.id,
                          id: record.id,
                          value: record.goal.is_archived ? false : true,
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
      size="middle"
    />
  );
}

export default GoalsCustomTable;

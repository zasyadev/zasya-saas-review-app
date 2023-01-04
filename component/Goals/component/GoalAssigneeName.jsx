import { Tooltip } from "antd";

import {
  BankOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  INDIVIDUAL_TYPE,
  ORGANIZATION_TYPE,
  SELF_TYPE,
  TEAM_TYPE,
} from "../constants";

import { getAssigneeName } from "../helper";

export const GoalAssigneeName = ({ record, userId, ShowAssigneeModal }) => {
  return (
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
  );
};

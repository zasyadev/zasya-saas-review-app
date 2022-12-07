import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";

function GoalsList({ user }) {
  const [loading, setLoading] = useState(false);
  const [goalsList, setGoalsList] = useState([]);

  async function fetchGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchGoalList();
  }, []);

  const columns = [
    {
      title: "Goal Name",
      key: "goal_title",
      dataIndex: "goal_title",
    },
    {
      title: "Type    ",
      key: "goal_type",
      dataIndex: "goal_type",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Progress",
      key: "progress",
      dataIndex: "progress",
    },
    {
      title: "End Date",
      key: "end_date",
      dataIndex: "end_date",
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="flex flex-row items-center justify-end flex-wrap gap-4  mb-4 md:mb-6 ">
          <PrimaryButton
            withLink={true}
            linkHref={`/goals/add`}
            title={"Create"}
          />
        </div>
        <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
          {loading ? (
            <div className="p-4">
              <Skeleton title={false} active={true} />
            </div>
          ) : (
            <CustomTable dataSource={goalsList} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalsList;

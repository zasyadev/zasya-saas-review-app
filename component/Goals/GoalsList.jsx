import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import GoalsGroupList from "./component/GoalsGroupList";

const groupItems = [
  {
    title: "Day",
    type: "daily",
  },
  {
    title: "Week",
    type: "weekly",
  },
  {
    title: "Month",
    type: "monthly",
  },
  {
    title: "Half Year",
    type: "halfyearly",
  },
];

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

        {loading ? (
          <div className="p-4">
            <Skeleton title={false} active={true} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {groupItems.map((groupItem) => (
              <GoalsGroupList
                goalsList={goalsList}
                userId={user.id}
                fetchGoalList={fetchGoalList}
                title={groupItem.title}
                key={groupItem.type}
                type={groupItem.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalsList;

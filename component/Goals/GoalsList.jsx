import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomSelectBox from "../common/CustomSelectBox";
import GoalsGroupList from "./component/GoalsGroupList";
import GoalsGroupListSkeleton from "./component/GoalsGroupListSkeleton";
import { goalsFilterList, groupItems } from "./constants";

function GoalsList({ user, isArchived = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goalsList, setGoalsList] = useState([]);

  async function fetchGoalList(status) {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals?status=${status}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }
  async function fetchArchivedGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals?isArchived=true`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  useEffect(() => {
    if (isArchived) {
      fetchArchivedGoalList();
    } else {
      fetchGoalList("All");
    }
  }, [isArchived]);

  const handleToggle = (value) => {
    if (value === "Archived") {
      router.push("/goals/archived");
    } else {
      fetchGoalList(value);
    }
  };

  return (
    <div className="container mx-auto max-w-full">
      {!isArchived && (
        <div className="flex justify-between items-center  flex-wrap gap-4  mb-4 md:mb-6 ">
          <CustomSelectBox
            className={" w-36 text-sm"}
            arrayList={goalsFilterList}
            handleOnChange={(selectedKey) => handleToggle(selectedKey)}
            defaultValue={"All"}
          />

          <PrimaryButton
            withLink={true}
            linkHref={`/goals/add`}
            title={"Create"}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
        {loading
          ? groupItems.map((groupItem) => (
              <GoalsGroupListSkeleton
                title={groupItem.title}
                key={groupItem.type + "skeleton"}
              />
            ))
          : groupItems.map((groupItem) => (
              <GoalsGroupList
                goalsList={goalsList}
                userId={user.id}
                fetchGoalList={
                  isArchived ? fetchArchivedGoalList : fetchGoalList
                }
                title={groupItem.title}
                key={groupItem.type}
                type={groupItem.type}
                isArchived={isArchived}
              />
            ))}
      </div>
    </div>
  );
}

export default GoalsList;

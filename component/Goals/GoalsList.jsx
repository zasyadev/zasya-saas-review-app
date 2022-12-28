import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomSelectBox from "../common/CustomSelectBox";
import GoalsGroupList from "./component/GoalsGroupList";
import GoalsGroupListSkeleton from "./component/GoalsGroupListSkeleton";
import GoalInfoCard from "./component/GoalsGroupList/components/GoalInfoCard";
import { goalsFilterList, groupItems } from "./constants";
import moment from "moment";

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

  const sortListByEndDate = useMemo(() => {
    if (Number(goalsList?.length) > 0) {
      const latestUpcomingGoalsList = goalsList
        .filter(
          (item) => moment(item?.goal?.end_date).diff(moment(), "days") >= 0
        )
        .sort((a, b) =>
          moment(a?.goal?.end_date).diff(moment(b?.goal?.end_date))
        );

      if (latestUpcomingGoalsList.length < 4) return latestUpcomingGoalsList;

      return latestUpcomingGoalsList.slice(0, 4);
    } else return [];
  }, [goalsList]);

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
      {!loading && !isArchived && Number(sortListByEndDate?.length) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {sortListByEndDate.map((item, idx) => (
            <GoalInfoCard
              item={item}
              key={"goal" + item.id + idx}
              isArchived={isArchived}
              userId={user.id}
              fetchGoalList={fetchGoalList}
            />
          ))}
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

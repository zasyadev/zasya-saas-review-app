import React, { useMemo } from "react";
import NoRecordFound from "../../../common/NoRecordFound";
import GoalInfoCard from "./components/GoalInfoCard";

const GoalsGroupList = ({
  goalsList,
  type,
  title,
  userId,
  fetchGoalList,
  isArchived,
  goalEditHandle,
  updateGoalForm,
  setEditGoalModalVisible,
  ShowAssigneeModal,
}) => {
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
            <GoalInfoCard
              item={item}
              key={"goal" + item.id}
              isArchived={isArchived}
              userId={userId}
              fetchGoalList={fetchGoalList}
              goalEditHandle={goalEditHandle}
              updateGoalForm={updateGoalForm}
              setEditGoalModalVisible={setEditGoalModalVisible}
              ShowAssigneeModal={ShowAssigneeModal}
            />
          ))
        ) : (
          <NoRecordFound title={"No Goals Found"} />
        )}
      </div>
    </div>
  );
};

export default GoalsGroupList;

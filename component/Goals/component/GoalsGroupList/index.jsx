import React, { useMemo, useState } from "react";
import NoRecordFound from "../../../common/NoRecordFound";
import GoalAssignessModal from "../../GoalAssignessModal";
import GoalInfoCard from "./components/GoalInfoCard";

const initialGoalCountModalData = {
  goal_title: "",
  GoalAssignee: [],
  isVisible: false,
};

const GoalsGroupList = ({
  goalsList,
  type,
  title,
  userId,
  fetchGoalList,
  isArchived,
}) => {
  const [goalAssigneeModalData, setGoalAssigneeModalData] = useState(
    initialGoalCountModalData
  );

  const filteredGoalList = useMemo(
    () =>
      goalsList?.length
        ? goalsList.filter((item) => item?.goal?.frequency === type)
        : [],

    [goalsList?.length]
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
  }, [goalsList?.length]);

  // const ShowAssigneeModal = ({ goal_title, GoalAssignee }) => {
  //   setGoalAssigneeModalData({
  //     goal_title,
  //     GoalAssignee,
  //     isVisible: true,
  //   });
  // };

  const hideAssigneeModal = () => {
    setGoalAssigneeModalData(initialGoalCountModalData);
  };

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
            />
          ))
        ) : (
          <NoRecordFound title={"No Goals Found"} />
        )}
      </div>

      {goalAssigneeModalData?.isVisible && (
        <GoalAssignessModal
          goalAssigneeModalData={goalAssigneeModalData}
          hideAssigneeModal={hideAssigneeModal}
          userId={userId}
        />
      )}
    </div>
  );
};

export default GoalsGroupList;

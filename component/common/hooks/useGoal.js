import { useEffect, useState } from "react";
import httpService from "../../../lib/httpService";
import { HookNotFoundMsg } from "../../../constants";

export const useGoal = (status) => {
  const [goalList, setGoalList] = useState([]);
  const [goalListError, setGoalListError] = useState("");
  const [goalListLoading, setGoalListLoading] = useState(false);

  async function fetchGoals(status) {
    setGoalListLoading(true);
    await httpService
      .get(`/api/goals?status=${status}`)
      .then(({ data: response }) => setGoalList(response.data))
      .catch(() => {
        setGoalListError(HookNotFoundMsg);
        setGoalList([]);
      })
      .finally(() => setGoalListLoading(false));
  }

  useEffect(() => {
    fetchGoals(status);
  }, [status]);

  return {
    goalList,
    goalListError,
    goalListLoading,
  };
};

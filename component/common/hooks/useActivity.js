import { useEffect, useState } from "react";
import httpService from "../../../lib/httpService";
import { HookNotFoundMsg } from "../../../constants";

export const useActivity = (userId) => {
  const [activityList, setActivityList] = useState([]);
  const [activityListError, setActivityListError] = useState("");
  const [activityListLoading, setActivityListLoading] = useState(false);

  async function fetchActivities() {
    setActivityListLoading(true);
    await httpService
      .get(`/api/activity/${userId}`)
      .then(({ data: response }) => setActivityList(response.data))
      .catch(() => {
        setActivityListError(HookNotFoundMsg);
        setActivityList([]);
      })
      .finally(() => setActivityListLoading(false));
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activityList,
    activityListError,
    activityListLoading,
  };
};

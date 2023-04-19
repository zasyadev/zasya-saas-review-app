import { useEffect } from "react";
import { DATA_NOT_FOUND_MSG } from "../../../constants";
import httpService from "../../../lib/httpService";
import { SET_ERROR, SET_LIST, SET_LOADING } from "../reducer/action";
import { useCommonReducer } from "./useCommonReducer";

export const useActivity = (userId) => {
  const {
    dataList: activityList,
    dataLoading: activityListLoading,
    dataError: activityListError,
    dispatch,
  } = useCommonReducer();

  async function fetchActivities() {
    dispatch({ type: SET_LOADING, payload: true });

    try {
      const { data: response } = await httpService.get(
        `/api/activity/${userId}`
      );
      dispatch({ type: SET_LIST, payload: response.data });
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: error?.message ?? DATA_NOT_FOUND_MSG,
      });
      dispatch({ type: SET_LIST, payload: [] });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
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

import { useEffect } from "react";
import { DATA_NOT_FOUND_MSG } from "../../../constants";
import httpService from "../../../lib/httpService";
import { SET_ERROR, SET_LIST, SET_LOADING } from "../reducer/action";
import { useCommonReducer } from "./useCommonReducer";

export const useGoal = (status) => {
  const {
    dataList: goalList,
    dataLoading: goalListLoading,
    dataError: goalListError,
    dispatch,
  } = useCommonReducer();

  async function fetchGoals(status) {
    dispatch({ type: SET_LOADING, payload: true });

    try {
      const { data: response } = await httpService.get(
        `/api/goals?status=${status}`
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
    fetchGoals(status);
  }, [status]);

  return {
    goalList,
    goalListError,
    goalListLoading,
  };
};

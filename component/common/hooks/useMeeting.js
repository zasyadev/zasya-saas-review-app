import { useEffect } from "react";
import { DATA_NOT_FOUND_MSG } from "../../../constants";
import httpService from "../../../lib/httpService";
import { SET_ERROR, SET_LIST, SET_LOADING } from "../reducer/action";
import { useCommonReducer } from "./useCommonReducer";

export const useMeeting = () => {
  const {
    dataList: meetingList,
    dataLoading: meetingListLoading,
    dataError: meetingListError,
    dispatch,
  } = useCommonReducer();

  async function fetchMeeting() {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const { data: response } = await httpService.get(`/api/meetings`);
      dispatch({ type: SET_LIST, payload: response.data });
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: error?.message ?? DATA_NOT_FOUND_MSG,
      });
    }
  }

  useEffect(() => {
    fetchMeeting();
  }, []);

  return {
    meetingList,
    meetingListError,
    meetingListLoading,
  };
};

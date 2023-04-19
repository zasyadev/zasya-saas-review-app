import { useEffect } from "react";
import { DATA_NOT_FOUND_MSG } from "../../../constants";
import httpService from "../../../lib/httpService";
import { SET_ERROR, SET_LIST, SET_LOADING } from "../reducer/action";
import { useCommonReducer } from "./useCommonReducer";

export const useMember = (user) => {
  const {
    dataList: membersList,
    dataLoading: membersListLoading,
    dataError: membersListError,
    dispatch,
  } = useCommonReducer();

  async function fetchMember(user) {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const { data: response } = await httpService.get(
        `/api/member/${user.id}`
      );
      const filterData = response.data.filter(
        (item) => item.user_id != user.id && item.user.status
      );
      dispatch({ type: SET_LIST, payload: filterData });
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
    fetchMember(user);
  }, []);

  return {
    membersList,
    membersListError,
    membersListLoading,
  };
};

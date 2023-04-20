import { useEffect } from "react";
import { DATA_NOT_FOUND_MSG } from "../../../constants";
import httpService from "../../../lib/httpService";
import { SET_ERROR, SET_LIST, SET_LOADING } from "../reducer/action";
import { useCommonReducer } from "./useCommonReducer";

export const useOrganizationUser = (userId) => {
  const {
    dataList: userList,
    dataLoading: userListLoading,
    dataError: userListError,
    dispatch,
  } = useCommonReducer();

  async function fetchUserList() {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const { data: response } = await httpService.get(
        `/api/user/organizationId`
      );
      const filterData = response.data.filter(
        (item) => item.user.status && item.user_id != userId
      );
      dispatch({ type: SET_LIST, payload: filterData });
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: error?.message ?? DATA_NOT_FOUND_MSG,
      });
    }
  }

  useEffect(() => {
    fetchUserList();
  }, []);

  return {
    userList,
    userListError,
    userListLoading,
  };
};

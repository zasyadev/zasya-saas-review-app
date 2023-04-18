import { useEffect, useState } from "react";
import httpService from "../../../lib/httpService";
import { HookNotFoundMsg } from "../../../constants";

export const useOrganizationUser = (userId) => {
  const [userList, setUserList] = useState([]);
  const [userListError, setUserListError] = useState("");
  const [userListLoading, setUserListLoading] = useState(false);

  async function fetchUserList() {
    setUserListLoading(true);
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        let filterData = response.data.filter(
          (item) => item.user.status && item.user_id != userId
        );
        setUserList(filterData);
      })
      .catch(() => {
        setUserListLoading(false);
        setUserListError(HookNotFoundMsg);
        setUserList([]);
      });
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

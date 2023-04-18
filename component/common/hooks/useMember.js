import { useEffect, useState } from "react";
import httpService from "../../../lib/httpService";
import { HookNotFoundMsg } from "../../../constants";

export const useMember = (user) => {
  const [membersList, setMemberList] = useState([]);
  const [membersListError, setMemberListError] = useState("");
  const [membersListLoading, setMemberListLoading] = useState(false);

  async function fetchMember(user) {
    setMemberListLoading(true);
    await httpService
      .get(`/api/member/${user.id}`)
      .then(({ data }) => {
        let filterData = data.data.filter(
          (item) => item.user_id != user.id && item.user.status
        );
        setMemberList(filterData);
      })
      .catch(() => {
        setMemberList([]);
        setMemberListError(HookNotFoundMsg);
      })
      .finally(() => setMemberListLoading(false));
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

import { useEffect, useState } from "react";
import httpService from "../../../lib/httpService";

const NotFound = "List Not Found";

export const MemberListHook = (user) => {
  const [membersList, setMemberList] = useState([]);
  const [membersListError, setMemberListError] = useState("");
  const [membersListLoading, setMemberListLoading] = useState(false);

  async function fetchMember(user) {
    setMemberListLoading(true);
    await httpService
      .get(`/api/member/${user.id}`)
      .then(({ data }) => {
        if (data.status === 200) {
          let filterData = data.data.filter(
            (item) => item.user_id != user.id && item.user.status
          );
          setMemberList(filterData);
        }
        setMemberListLoading(false);
      })
      .catch((err) => {
        setMemberList([]);
        setMemberListError(NotFound);
        setMemberListLoading(false);
      });
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

export const GoalListHook = (status) => {
  const [goalList, setGoalList] = useState([]);
  const [goalListError, setGoalListError] = useState("");
  const [goalListLoading, setGoalListLoading] = useState(false);

  async function fetchGoals(status) {
    setGoalListLoading(true);
    await httpService
      .get(`/api/goals?status=${status}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalList(response.data);
        }
        setGoalListLoading(false);
      })
      .catch((err) => {
        setGoalListLoading(false);
        setGoalListError(NotFound);
        setGoalList([]);
      });
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

export const MeetingListHook = () => {
  const [meetingList, setMeetingList] = useState([]);
  const [meetingListError, setMeetingListError] = useState("");
  const [meetingListLoading, setMeetingListLoading] = useState(false);

  async function fetchMeeting() {
    setMeetingListLoading(true);
    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMeetingList(response.data);
        }
        setMeetingListLoading(false);
      })
      .catch((err) => {
        setMeetingListLoading(false);
        setMeetingListError(NotFound);
        setMeetingList([]);
      });
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

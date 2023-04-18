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
        let filterData = data.data.filter(
          (item) => item.user_id != user.id && item.user.status
        );
        setMemberList(filterData);
      })
      .catch(() => {
        setMemberList([]);
        setMemberListError(NotFound);
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

export const GoalListHook = (status) => {
  const [goalList, setGoalList] = useState([]);
  const [goalListError, setGoalListError] = useState("");
  const [goalListLoading, setGoalListLoading] = useState(false);

  async function fetchGoals(status) {
    setGoalListLoading(true);
    await httpService
      .get(`/api/goals?status=${status}`)
      .then(({ data: response }) => setGoalList(response.data))
      .catch(() => {
        setGoalListError(NotFound);
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

export const MeetingListHook = () => {
  const [meetingList, setMeetingList] = useState([]);
  const [meetingListError, setMeetingListError] = useState("");
  const [meetingListLoading, setMeetingListLoading] = useState(false);

  async function fetchMeeting() {
    setMeetingListLoading(true);
    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => setMeetingList(response.data))
      .catch(() => {
        setMeetingListError(NotFound);
        setMeetingList([]);
      })
      .finally(() => setMeetingListLoading(false));
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

export const ActivityListHook = (userId) => {
  const [activityList, setActivityList] = useState([]);
  const [activityListError, setActivityListError] = useState("");
  const [activityListLoading, setActivityListLoading] = useState(false);

  async function fetchActivities() {
    setActivityListLoading(true);
    await httpService
      .get(`/api/activity/${userId}`)
      .then(({ data: response }) => setActivityList(response.data))
      .catch(() => {
        setActivityListError(NotFound);
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

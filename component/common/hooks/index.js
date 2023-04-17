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
        setGoalList(response.data);
      })
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

export const NotificationListHook = (userId) => {
  const [notificationList, setNotificationList] = useState([]);
  const [notificationListError, setNotificationListError] = useState("");
  const [notificationListLoading, setNotificationListLoading] = useState(false);

  async function fetchNotification() {
    setNotificationListLoading(true);
    await httpService
      .get(`/api/notification/${userId}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setNotificationList(response.data);
        }
        setNotificationListLoading(false);
      })
      .catch((err) => {
        setNotificationListLoading(false);
        setNotificationListError(NotFound);
        setNotificationList([]);
      });
  }

  useEffect(() => {
    fetchNotification();
  }, []);

  return {
    notificationList,
    notificationListError,
    notificationListLoading,
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
      .then(({ data: response }) => {
        if (response.status === 200) {
          setActivityList(response.data);
        }
        setActivityListLoading(false);
      })
      .catch((err) => {
        setActivityListLoading(false);
        setActivityListError(NotFound);
        setActivityList([]);
      });
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

export const OrganizationUserListHook = (userId) => {
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
        setUserListError(NotFound);
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

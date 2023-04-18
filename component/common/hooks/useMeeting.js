import { useEffect, useState } from "react";
import httpService from "../../../lib/httpService";
import { HookNotFoundMsg } from "../../../constants";

export const useMeeting = () => {
  const [meetingList, setMeetingList] = useState([]);
  const [meetingListError, setMeetingListError] = useState("");
  const [meetingListLoading, setMeetingListLoading] = useState(false);

  async function fetchMeeting() {
    setMeetingListLoading(true);
    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => setMeetingList(response.data))
      .catch(() => {
        setMeetingListError(HookNotFoundMsg);
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

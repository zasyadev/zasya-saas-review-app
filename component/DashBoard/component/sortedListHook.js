import moment from "moment";
import { useGoal } from "../../common/hooks/useGoal";
import { useMeeting } from "../../common/hooks/useMeeting";
import { GOALS_FILTER_STATUS } from "../../Goals/constants";
import { useMemo } from "react";

export function sortedListHook() {
  const { goalList, goalListLoading } = useGoal(GOALS_FILTER_STATUS.ALL);
  const { meetingList, meetingListLoading } = useMeeting();

  return useMemo(() => {
    const latestUpcomingGoalsList = goalList
      .filter(
        (item) => moment(item?.goal?.end_date).diff(moment(), "days") >= 0
      )
      .sort((a, b) => moment(a?.goal?.end_date).diff(moment(b?.goal?.end_date)))
      .slice(0, 3);
    const latestMeetingList = meetingList
      .filter((item) => moment(item?.meeting_at).diff(moment(), "minutes") >= 0)
      .sort((a, b) => moment(a?.meeting_at).diff(moment(b?.meeting_at)))
      .slice(0, 3);

    return {
      sortGoalListByEndDate: latestUpcomingGoalsList,
      sortMeetingListByDate: latestMeetingList,
      goalListLoading,
      meetingListLoading,
    };
  }, [goalList, meetingList]);
}

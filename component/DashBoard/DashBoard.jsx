import {
  CalendarOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import clsx from "clsx";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ColorApplaudIcon } from "../../assets/icons";
import { URLS } from "../../constants/urls";
import { dateDayName, dateTime } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import { GoalListHook, MeetingListHook } from "../common/hooks";
import NoRecordFound from "../common/NoRecordFound";
import { statusBackground, statusPill } from "../Goals/constants";
import SiderRight from "../SiderRight/SiderRight";
import DashboardGoalsAvatar from "./component/DashboardGoalsAvatar";
import HeaderNotification from "./component/HeaderNotification";
import { CountCard, DateBox } from "./component/helperComponent";

const BarChart = dynamic(() => import("../common/BarChart"), {
  ssr: false,
});

function DashBoard({ user }) {
  const defaultDashboardData = {
    reviewRating: [],
    averageAnswerTime: 0,
    totalGoals: 0,
    totalApplauds: 0,
    totalReviews: 0,
    pendingGoals: 0,
    goalsProgress: 0,
  };
  const defaultMonthlyLeaderboardData = {
    leaderBoardData: [],
    leaderboardLoading: true,
  };

  const { goalList, goalListLoading } = GoalListHook("All");
  const { meetingList, meetingListLoading } = MeetingListHook();
  const [dashBoardData, setDashboardData] = useState(defaultDashboardData);
  const [monthlyLeaderBoardData, setMonthlyLeaderBoardData] = useState(
    defaultMonthlyLeaderboardData
  );

  const currentMonth = {
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  };

  async function fetchDashboardData() {
    await httpService
      .get(`/api/dashboard`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setDashboardData(response.data);
        }
      })
      .catch((err) => {
        setDashboardData(defaultDashboardData);
      });
  }
  async function fetchMonthlyLeaderBoardData() {
    await httpService
      .post(`/api/dashboard/leaderboard`, {
        date: currentMonth,
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMonthlyLeaderBoardData({
            leaderBoardData: response.data,
            leaderboardLoading: false,
          });
        }
      })
      .catch((err) => {
        setMonthlyLeaderBoardData({
          leaderBoardData: [],
          leaderboardLoading: false,
        });
      });
  }

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyLeaderBoardData();
  }, []);

  const sortGoalListByEndDate = useMemo(() => {
    if (Number(goalList?.length) > 0) {
      const latestUpcomingGoalsList = goalList
        .filter(
          (item) => moment(item?.goal?.end_date).diff(moment(), "days") >= 0
        )
        .sort((a, b) =>
          moment(a?.goal?.end_date).diff(moment(b?.goal?.end_date))
        );

      if (latestUpcomingGoalsList.length < 3) return latestUpcomingGoalsList;

      return latestUpcomingGoalsList.slice(0, 3);
    } else return [];
  }, [goalList]);
  const sortMeetingListByDate = useMemo(() => {
    if (Number(meetingList?.length) > 0) {
      const latestMeetingList = meetingList
        .filter(
          (item) => moment(item?.meeting_at).diff(moment(), "minutes") >= 0
        )
        .sort((a, b) => moment(a?.meeting_at).diff(moment(b?.meeting_at)));

      if (latestMeetingList.length < 3) return latestMeetingList;

      return latestMeetingList.slice(0, 3);
    } else return [];
  }, [meetingList]);

  return (
    <div className="grid grid-cols-7 gap-4 md:gap-8 xl:gap:10 bg-brandGray-100">
      <div className="col-span-7 md:col-span-5  border-r border-gray-300 p-4 md:p-6 xl:p-8 space-y-4 md:space-y-6 xl:space-y-8 bg-white">
        <HeaderNotification user={user} dashBoardData={dashBoardData} />
        <div className="bg-white  rounded-md shadow-brand">
          <div className="mb-4 grid md:grid-cols-3 border-b border-gray-300">
            <CountCard
              title={"Total Reviews"}
              count={dashBoardData.totalReviews}
              className="cursor-pointer"
              Icon={() => <FileTextOutlined />}
              iconClassName={"text-brandOrange-100 bg-brandOrange-10 text-lg"}
              href={URLS.REVIEW_CREATED}
            />

            <CountCard
              title={"Total Goals"}
              count={dashBoardData.totalGoals}
              className="cursor-pointer"
              Icon={() => <CrownOutlined />}
              iconClassName={"text-brandGreen-100 bg-brandGreen-10 text-lg"}
              href={URLS.GOAL}
            />

            <CountCard
              title={"Total Applaud"}
              count={dashBoardData.totalApplauds}
              className="cursor-pointer"
              Icon={() => <ColorApplaudIcon color="#0091f6" />}
              iconClassName={"text-brandBlue-100 bg-brandBlue-10"}
              href={URLS.APPLAUD}
            />
          </div>
          <div className="w-full p-4  overflow-hidden ">
            <BarChart user={user} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap:10">
          <div className="w-full bg-white rounded-md overflow-hidden shadow-brand h-full flex flex-col">
            <h2 className="text-lg font-semibold  mb-0 flex items-center justify-between gap-3 border-b border-gray-300 px-5 py-3">
              <span className="flex-1"> Upcoming Goals</span>
              <Link href={URLS.GOAL} passHref>
                <span className=" text-sm font-medium text-primary-green cursor-pointer hover:underline">
                  View All
                </span>
              </Link>
            </h2>
            <div className="divide-y">
              {goalListLoading ? (
                <div className="p-4">
                  <Skeleton />
                </div>
              ) : sortGoalListByEndDate.length > 0 ? (
                sortGoalListByEndDate.map((item, idx) => {
                  if (idx <= 2) {
                    return (
                      <div
                        className="flex items-center space-x-4 px-5 py-3"
                        key={item.id + idx}
                      >
                        <div className="shrink-0">
                          <DateBox
                            date={item.goal.end_date}
                            className={statusBackground(item.goal.status)}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 font-medium text-base break-all single-line-clamp">
                            {item.goal.goal_title}
                          </p>
                          <p className="flex justify-between items-center">
                            <span
                              className={clsx(
                                "text-xs font-semibold px-2 py-1 uppercase rounded-md ",
                                statusPill(item.goal.status)
                              )}
                            >
                              {item.goal.status}
                            </span>
                            <DashboardGoalsAvatar
                              activeGoalUsers={item.goal.GoalAssignee}
                            />
                          </p>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <NoRecordFound title="No Goals Found" />
              )}
            </div>
          </div>
          <div className="w-full bg-white rounded-md overflow-hidden shadow-brand h-full flex flex-col">
            <h2 className="text-lg font-semibold  mb-0 flex items-center justify-between gap-3 border-b border-gray-300 px-5 py-3">
              <span className="flex-1"> Upcoming Follow Ups</span>
              <Link href={URLS.FOLLOW_UP} passHref>
                <span className=" text-sm font-medium text-primary-green cursor-pointer hover:underline">
                  View All
                </span>
              </Link>
            </h2>
            <div className="divide-y">
              {meetingListLoading ? (
                <div className="p-4">
                  <Skeleton />
                </div>
              ) : sortMeetingListByDate.length > 0 ? (
                sortMeetingListByDate.map((item, idx) => {
                  if (idx <= 2) {
                    return (
                      <div
                        className="flex items-center space-x-4 px-5 py-3"
                        key={item.id + idx}
                      >
                        <div className="shrink-0">
                          <DateBox date={item.meeting_at} />
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 font-medium text-base break-all single-line-clamp">
                            {item.meeting_title}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="flex  items-center text-brandGray-600">
                              <span className="leading-0 text-primary-green pr-1 text-base">
                                <CalendarOutlined />
                              </span>

                              {dateDayName(item.meeting_at)}
                            </span>
                            <span className="flex  items-center text-brandGray-600">
                              <span className="leading-0 text-primary-green pr-1 text-base">
                                <ClockCircleOutlined />
                              </span>
                              {dateTime(item.meeting_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <NoRecordFound title="No Meetings Found" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-7 md:col-span-2 space-y-4 p-4  md:pl-0 bg-brandGray-100">
        <SiderRight
          dashBoardData={dashBoardData}
          monthlyLeaderBoardData={monthlyLeaderBoardData}
          userId={user.id}
        />
      </div>
    </div>
  );
}

export default DashBoard;

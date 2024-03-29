import {
  CalendarOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Skeleton } from "antd";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ColorApplaudIcon } from "../../assets/icons";
import { URLS } from "../../constants/urls";
import { dateDayName, dateTime } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import SiderRight from "../SiderRight/SiderRight";
import NoRecordFound from "../common/NoRecordFound";
import DashboardGoalsAvatar from "./component/DashboardGoalsAvatar";
import HeaderNotification from "./component/HeaderNotification";
import { CountCard, DateBox } from "./component/helperComponent";
import { defaultCurrentMonth } from "../../helpers/momentHelper";
import { getStatusBackground, getStatusPillColor } from "../../helpers/utils";
import { sortedListHook } from "./component/sortedListHook";

const AreaChart = dynamic(() => import("../common/AreaChart"), {
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

  const {
    sortGoalListByEndDate,
    sortMeetingListByDate,
    goalListLoading,
    meetingListLoading,
  } = sortedListHook();
  const [dashBoardData, setDashboardData] = useState(defaultDashboardData);
  const [monthlyLeaderBoardData, setMonthlyLeaderBoardData] = useState(
    defaultMonthlyLeaderboardData
  );

  async function fetchDashboardData() {
    await httpService
      .get(`/api/dashboard`)
      .then(({ data: response }) => setDashboardData(response.data))
      .catch(() => setDashboardData(defaultDashboardData));
  }
  async function fetchMonthlyLeaderBoardData() {
    await httpService
      .post(`/api/dashboard/leaderboard`, {
        date: defaultCurrentMonth,
        userId: user.id,
      })
      .then(({ data: response }) =>
        setMonthlyLeaderBoardData({
          leaderBoardData: response.data,
          leaderboardLoading: false,
        })
      )
      .catch(() =>
        setMonthlyLeaderBoardData({
          leaderBoardData: [],
          leaderboardLoading: false,
        })
      );
  }

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyLeaderBoardData();
  }, []);

  return (
    <div className="grid grid-cols-7 gap-4 lg:gap-8 xl:gap:10 bg-brandGray-100 ">
      <div className="col-span-7 dashboard-screen custom-scrollbar md:col-span-5  border-r border-gray-300 overflow-auto p-4 md:p-6 xl:p-8 space-y-4 md:space-y-6 xl:space-y-8 bg-white">
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
            <AreaChart user={user} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 lg:gap-8 xl:gap:10">
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
                            className={getStatusBackground(item.goal.status)}
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`${URLS.GOAL}/${item.goal.id}/detail`}
                            passHref
                          >
                            <p className="mb-2 font-medium text-base break-all single-line-clamp cursor-pointer hover:underline">
                              {item.goal.goal_title}
                            </p>
                          </Link>
                          <p className="flex justify-between items-center">
                            <span
                              className={clsx(
                                "text-xs font-semibold px-2 py-1 uppercase rounded-md ",
                                getStatusPillColor(item.goal.status)
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
                          <Link href={`${URLS.FOLLOW_UP}/${item.id}`} passHref>
                            <p className="mb-2 font-medium text-base break-all single-line-clamp cursor-pointer hover:underline">
                              {item.meeting_title}
                            </p>
                          </Link>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-brandGray-600 text-sm lg:text-base">
                              <span className="leading-0 text-primary-green pr-1">
                                <CalendarOutlined />
                              </span>

                              {dateDayName(item.meeting_at)}
                            </span>
                            <span className="flex items-center text-brandGray-600 text-sm lg:text-base">
                              <span className="leading-0 text-primary-green pr-1">
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
      <div className="col-span-7 dashboard-screen custom-scrollbar md:col-span-2 space-y-4 p-4  md:pl-0 bg-brandGray-100 overflow-auto">
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

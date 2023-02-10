import {
  CalendarOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Select, Skeleton } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { ColorApplaudIcon } from "../../assets/icons";
import { dateDayName, dateTime } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import { GoalListHook, MeetingListHook, MemberListHook } from "../common/hooks";
import NoRecordFound from "../common/NoRecordFound";
import { statusBackground, statusPill } from "../Goals/constants";
import UserProfileHeader from "../layout/components/UserProfileHeader";
import SiderRight from "../SiderRight/SiderRight";
import DashboardGoalsAvatar from "./component/DashboardGoalsAvatar";
import { CountCard, DateBox } from "./component/helperComponent";

const BarChart = dynamic(() => import("../common/BarChart"), {
  ssr: false,
});

function DashBoard({ user }) {
  const defaultDashboardData = {
    reviewCreatedCount: 0,
    reviewAnsweredCount: 0,
    userCount: 0,
    applaudCount: 0,
    reviewRating: [],
    averageAnswerTime: 0,
  };
  const defaultMonthlyLeaderboardData = {
    applaudData: [],
    reviewRating: [],
  };
  const { membersList } = MemberListHook(user);
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
      .post(`/api/dashboard/monthly_leaderboard`, {
        date: currentMonth,
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMonthlyLeaderBoardData(response.data);
        }
      })
      .catch((err) => {});
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
    <div className="grid grid-cols-7 gap-4">
      <div className="col-span-7 md:col-span-5  border-r border-gray-300 p-4 space-y-4">
        <div className="">
          <Select
            size="large"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            className="w-44"
          >
            {membersList.map((data, index) => (
              <Select.Option key={index} value={data.user_id}>
                {data?.user?.first_name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="bg-brandSkin-100 p-4  rounded-md">
          <p className="font-bold  mb-0 uppercase">Hi {user.first_name}</p>
          <p className="mb-0 font-medium">
            You have <span className="font-semibold text-primary-green">4</span>{" "}
            goals pending as you have completed{" "}
            <span className="font-semibold text-primary-green">50%</span> of
            goals.
          </p>
        </div>
        <div className="bg-white  rounded-md">
          <div className="mb-4 grid md:grid-cols-3 border-b border-gray-300">
            <CountCard
              title={"Total Reviews"}
              count={dashBoardData.reviewCreatedCount}
              className="cursor-pointer"
              Icon={() => <FileTextOutlined />}
              iconClassName={"text-brandOrange-100 bg-brandOrange-10 text-lg"}
            />
            <CountCard
              title={"Total Goals"}
              count={dashBoardData.reviewCreatedCount}
              className="cursor-pointer"
              Icon={() => <CrownOutlined />}
              iconClassName={"text-brandGreen-100 bg-brandGreen-10 text-lg"}
            />
            <CountCard
              title={"Total Applaud"}
              count={dashBoardData.reviewCreatedCount}
              className="cursor-pointer"
              Icon={() => <ColorApplaudIcon color="#0091f6" />}
              iconClassName={"text-brandBlue-100 bg-brandBlue-10"}
            />
          </div>
          <div className="w-full p-4  overflow-hidden ">
            <BarChart user={user} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="w-full bg-white rounded-md overflow-hidden shadow-md h-full flex flex-col">
            <h2 className="text-lg font-semibold  mb-0 flex items-center justify-between gap-3 border-b border-gray-300 px-5 py-3">
              <span className="flex-1"> Upcoming Goals</span>
              <span className=" text-sm font-medium text-primary-green cursor-pointer hover:underline">
                View All
              </span>
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
                      <div className="flex items-center space-x-4 px-5 py-3">
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
                              className={`text-xs font-semibold px-2 py-1 uppercase rounded-md ${statusPill(
                                item.goal.status
                              )}`}
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
          <div className="w-full bg-white rounded-md overflow-hidden shadow-md h-full flex flex-col">
            <h2 className="text-lg font-semibold  mb-0 flex items-center justify-between gap-3 border-b border-gray-300 px-5 py-3">
              <span className="flex-1"> Upcoming Meetings</span>
              <span className=" text-sm font-medium text-primary-green cursor-pointer hover:underline">
                View All
              </span>
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
                      <div className="flex items-center space-x-4 px-5 py-3">
                        <div className="shrink-0">
                          <DateBox date={item.meeting_at} />
                        </div>
                        <div className="flex-1">
                          <p className="mb-2 font-medium text-base break-all single-line-clamp">
                            {item.meeting_title}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="flex  items-center text-brandGray-200">
                              <span className="leading-0 text-primary-green pr-1 text-base">
                                <CalendarOutlined />
                              </span>

                              {dateDayName(item.meeting_at)}
                            </span>
                            <span className="flex  items-center text-brandGray-200">
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
        <div className="container mx-auto max-w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-6"></div>
          <div className="md:hidden">
            <SiderRight
              dashBoardData={dashBoardData}
              monthlyLeaderBoardData={monthlyLeaderBoardData}
            />
          </div>
          {/* 
          <Row gutter={[24, 24]}>
            <Col md={12} lg={12} xs={24}>
              <div className="w-full bg-white rounded-md overflow-hidden shadow-md p-5 h-full">
                <h2 className="text-xl text-primary  font-semibold mb-2 flex items-center gap-3 justify-between">
                  <span className="flex-1"> Feedback Leaderboard</span>
                  <span className="leading-4 text-base  text-gray-900">
                    {CustomPopover(
                      "Feedback received and given count by your team members"
                    )}
                  </span>
                </h2>
                <Row className="dashboard-feedback">
                  <Col xs={24} md={24}>
                    {feedbackList.length > 0 ? (
                      feedbackList.map((feedback, idx) => {
                        return Object.entries(feedback).map(([key, value]) => (
                          <Row className="my-3" key={idx + key + "feedback"}>
                            <Col xs={6} md={5}>
                              <DefaultImages
                                imageSrc={value?.image}
                                width={70}
                                height={70}
                              />
                            </Col>

                            <Col xs={18} md={19}>
                              <div className="px-4">
                                <p className="mb-2 text-primary font-medium text-sm">
                                  {key}
                                </p>
                                <p className="flex justify-between mr-0 md:mr-3">
                                  <span className="flex" title="Feedback given">
                                    <FileRightIcon />
                                    <span className="pl-2 text-sm font-medium text-gray-500">
                                      {value.feedbackGiven ?? 0}
                                    </span>
                                  </span>
                                  <span
                                    className="flex"
                                    title="Feedback received"
                                  >
                                    <FileLeftIcon />
                                    <span className="pl-2 text-sm font-medium text-gray-500">
                                      {value.feedbackTaken ?? 0}
                                    </span>
                                  </span>
                                </p>
                              </div>
                            </Col>
                          </Row>
                        ));
                      })
                    ) : (
                      <div className="flex justify-center items-center h-48 ">
                        <p className="text-center">No Record Found</p>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row> */}
        </div>
      </div>
      <div className="col-span-7 md:col-span-2 space-y-4 p-4  pl-0 ">
        <div className="w-full">
          <UserProfileHeader user={user} />
        </div>

        <SiderRight
          dashBoardData={dashBoardData}
          monthlyLeaderBoardData={monthlyLeaderBoardData}
        />
      </div>
    </div>
  );
}

export default DashBoard;

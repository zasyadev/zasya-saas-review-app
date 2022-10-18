import { Col, Row } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  ApplaudIconSmall,
  FileLeftIcon,
  FileRightIcon,
  SmallApplaudIcon,
} from "../../assets/icons";
import httpService from "../../lib/httpService";
import CustomPopover from "../common/CustomPopover";
import DefaultImages from "../common/DefaultImages";
import SiderRight from "../SiderRight/SiderRight";

const BarChart = dynamic(() => import("../../component/common/Charts"), {
  ssr: false,
});

function CountCard({
  count,
  title,
  Icon,
  href = "#",
  className = "",
  tooltipText = "",
}) {
  return (
    <Link href={href} passHref>
      <div
        className={`bg-white p-4 rounded-md shadow-md transition-all duration-300 ease-in hover:bg-gradient-to-r hover:from-peach hover:to-peach-light ${className}`}
      >
        <div className="flex flex-wrap items-stretch h-full gap-3">
          <div className="bg-gradient-to-r from-peach to-peach-light text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink rounded-full">
            <Icon />
          </div>
          <div className="flex-1">
            <div className="text-primary flex items-start justify-between font-semibold tracking-wide text-sm gap-2 mb-2">
              <span className="flex-1">{title}</span>
              {tooltipText && (
                <span className="leading-4">{CustomPopover(tooltipText)}</span>
              )}
            </div>
            <span className="text-lg xl:text-xl 2xl:text-2xl text-primary font-semibold leading-6">
              {count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

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

  const [dashBoardData, setDashboardData] = useState(defaultDashboardData);
  const [monthlyLeaderBoardData, setMonthlyLeaderBoardData] = useState(
    defaultMonthlyLeaderboardData
  );

  const [feedbackList, setFeedbackList] = useState([]);
  const [allApplaud, setAllApplaud] = useState([]);
  const currentMonth = {
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  };

  async function fetchDashboardData() {
    await httpService
      .post(`/api/dashboard`, {
        userId: user.id,
        role: user.role_id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setDashboardData(response.data);
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
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
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  async function fetchFeedbackData() {
    await httpService
      .post(`/api/feedback/all`, {
        currentMonth: currentMonth,
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setFeedbackList(response.data);
        }
      })
      .catch((err) => {
        setFeedbackList([]);
        console.error(err.response.data?.message);
      });
  }

  async function fetchApplaudData() {
    await httpService
      .post(`/api/applaud/all`, {
        date: currentMonth,
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          let data = response?.data?.sort(
            (a, b) =>
              b[Object.keys(b)]?.taken?.length -
              a[Object.keys(a)]?.taken?.length
          );
          setAllApplaud(data);
        }
      })

      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchDashboardData();
    fetchFeedbackData();
    fetchApplaudData();
    fetchMonthlyLeaderBoardData();
  }, []);

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24} md={24} lg={16} xxl={18}>
        <div className="container mx-auto max-w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-6">
            <CountCard
              title={"Review Created"}
              count={dashBoardData.reviewCreatedCount}
              href="/review"
              className="cursor-pointer"
              Icon={() => <SmallApplaudIcon />}
              tooltipText="Count of Reviews Created by you."
            />

            <CountCard
              title={"Review Answered"}
              count={dashBoardData.reviewAnsweredCount}
              className="cursor-pointer"
              href="/review/received"
              Icon={() => (
                <Image
                  src={"/media/images/reviewicon.png"}
                  alt="logo"
                  width={20}
                  height={20}
                />
              )}
              tooltipText="Count of Reviews Answered by you."
            />

            <CountCard
              title={"Members"}
              count={dashBoardData.userCount}
              Icon={() => (
                <Image
                  src={"/media/images/threeusers.png"}
                  alt="icon"
                  width={20}
                  height={20}
                />
              )}
              tooltipText="Count of Members in your organization."
            />
          </div>

          <div className="w-full bg-white rounded-md overflow-hidden shadow-md p-4">
            <BarChart user={user} />
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={12}>
              <div className="w-full bg-white rounded-md overflow-hidden shadow-md p-4 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-between gap-3">
                  <span className="flex-1"> Applauds Leaderboard</span>
                  <span className="leading-4 text-base  text-gray-900">
                    {CustomPopover("Applauds count received by that member.")}
                  </span>
                </h2>
                <div className="flex-1 flex flex-col justify-between mt-1 md:mt-3">
                  <Row gutter={[16, 24]}>
                    {allApplaud.length > 0 ? (
                      allApplaud.map((item, idx) => {
                        if (idx <= 3) {
                          return (
                            <>
                              {Object.entries(item).map(([key, value]) => {
                                return (
                                  <Col
                                    xs={24}
                                    sm={12}
                                    md={12}
                                    key={"applaud" + idx}
                                  >
                                    <div className="flex items-center space-x-4 ">
                                      <div className="shrink-0">
                                        <DefaultImages
                                          imageSrc={value?.image}
                                        />
                                      </div>

                                      <div className="flex-1">
                                        <p className="mb-2 text-primary font-medium text-sm">
                                          {key}
                                        </p>
                                        <p className="flex">
                                          <ApplaudIconSmall />
                                          <span className="pl-2 text-sm font-medium text-gray-500">
                                            {value?.taken?.length}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </Col>
                                );
                              })}
                            </>
                          );
                        }
                      })
                    ) : (
                      <Col xs={24} md={24}>
                        <div className="flex justify-center items-center h-48">
                          <div className="text-center">No Applaud Found</div>
                        </div>
                      </Col>
                    )}
                  </Row>

                  {allApplaud.length > 0 && (
                    <div className=" text-center mt-2">
                      <Link href="/applaud/allapplaud" passHref>
                        <span className="text-primary text-sm inline  cursor-pointer font-medium hover:underline">
                          View All
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col md={12} lg={12} xs={24}>
              <div className="w-full bg-white rounded-md overflow-hidden shadow-md p-4 h-full">
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
          </Row>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8} xxl={6} className="h-full">
        <SiderRight
          dashBoardData={dashBoardData}
          monthlyLeaderBoardData={monthlyLeaderBoardData}
        />
      </Col>
    </Row>
  );
}

export default DashBoard;

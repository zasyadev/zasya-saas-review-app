import { Skeleton } from "antd";
import { Col, Row } from "antd/lib/grid";
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

const SiderRight = dynamic(() => import("../SiderRight/SiderRight"), {
  ssr: false,
});

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
    <Link href={href}>
      <div
        className={`bg-white rounded-xl shadow-md transition-all duration-300 ease-in hover:bg-gradient-to-r hover:from-peach hover:to-peach-light ${className}`}
      >
        <div className="px-4 py-5">
          <div className="flex flex-wrap items-start space-x-3">
            <div className="grd-bg-pink text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink rounded-full">
              <Icon />
            </div>
            <div className="flex-1">
              <div className="text-primary font-semibold tracking-wide text-sm  mb-1 flex items-center">
                {title}
                {tooltipText && (
                  <span className="leading-[0] ml-2">
                    {CustomPopover(tooltipText)}
                  </span>
                )}
              </div>
              <span className="text-2xl text-primary font-semibold ">
                {count}
              </span>
            </div>
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

  const [dashBoardData, setDashboardData] = useState(defaultDashboardData);

  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [allApplaud, setAllApplaud] = useState([]);
  const [currentMonth, setCurrentMonth] = useState({
    lte: moment().endOf("month"),
    gte: moment().startOf("month"),
  });

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
        console.error(err.response.data.message);
        setDashboardData(defaultDashboardData);
      });
  }

  async function fetchFeedbackData() {
    await httpService
      .get(`/api/feedback/all/${user.id}`, {
        userId: user.id,
        role: user.role_id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setFeedbackList(response.data);
        }
      })
      .catch((err) => {
        setFeedbackList([]);
        console.error(err.response.data.message);
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
        console.error(err.response.data.message);
      });
  }

  useEffect(() => {
    fetchDashboardData();
    fetchFeedbackData();
    fetchApplaudData();
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

          <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4">
            {loading ? (
              <Skeleton
                title={false}
                active={true}
                width={[200]}
                className="mt-4"
              />
            ) : (
              <BarChart user={user} />
            )}
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={12}>
              <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 h-full flex flex-col justify-between">
                <h2 className="text-xl mt-1 font-semibold text-primary mb-2 flex items-center">
                  Applauds Leaderboard
                  <span className="leading-[0] ml-2">
                    {CustomPopover("Applauds count received by that member.")}
                  </span>
                </h2>

                <Row gutter={[24, 24]}>
                  {allApplaud.length > 0 ? (
                    allApplaud.map((item, idx) => {
                      if (idx <= 3) {
                        return (
                          <>
                            {Object.entries(item).map(([key, value]) => {
                              return (
                                <Col xs={24} md={12} key={"applaud" + idx}>
                                  <Row className="">
                                    <Col xs={7} md={10}>
                                      <div className="p-2 mt-2 flex justify-center">
                                        <DefaultImages
                                          imageSrc={value?.image}
                                        />
                                      </div>
                                    </Col>

                                    <Col xs={17} md={14}>
                                      <div className="flex  justify-between items-center">
                                        <div className="py-2 px-3">
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
                                  </Row>
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

                {allApplaud.length > 0 ? (
                  <div className=" text-center mt-2">
                    <Link href="/applaud/allapplaud" passHref>
                      <span className="text-primary text-sm inline  cursor-pointer font-medium hover:underline">
                        View All
                      </span>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Col md={12} lg={12} xs={24}>
              <div className="w-full bg-white rounded-md overflow-hidden shadow-md p-4 h-full">
                <h2 className="text-xl mt-1 text-primary  font-semibold mb-2 flex items-center">
                  Feedback Leaderboard
                  <span className="leading-[0] ml-2">
                    {CustomPopover(
                      "Feedback received and given count by your team members"
                    )}
                  </span>
                </h2>
                <Row className="dashboard-feedback">
                  <Col xs={24} md={24}>
                    {feedbackList.length > 0 ? (
                      feedbackList.map((feedback, idx) => {
                        return (
                          <>
                            {Object.entries(feedback).map(([key, value]) => {
                              return (
                                <Row className="my-3" key={idx + "feedback"}>
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
                                        <span
                                          className="flex"
                                          title="Feedback given"
                                        >
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
                              );
                            })}
                          </>
                        );
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
        <SiderRight dashBoardData={dashBoardData} />
      </Col>
    </Row>
  );
}

export default DashBoard;

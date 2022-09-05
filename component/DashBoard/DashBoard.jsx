import React, { useState, useEffect } from "react";
import { Col, Row } from "antd/lib/grid";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  SmallApplaudIcon,
  ApplaudIconSmall,
  FileLeftIcon,
  FileRightIcon,
} from "../../assets/icons";
import { Skeleton } from "antd";
import Link from "next/link";
import moment from "moment";
import httpService from "../../lib/httpService";
import CustomPopover from "../common/CustomPopover";
import DefaultImages from "../common/DefaultImages";

const SiderRight = dynamic(() => import("../SiderRight/SiderRight"), {
  ssr: false,
});

const BarChart = dynamic(() => import("../../component/common/Charts"), {
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
    <Row gutter={[32, 32]}>
      <Col sm={24} md={24} lg={17}>
        <div classN>
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grd-bg-pink-hover bg-white rounded-xl transition-all duration-300 ease-in-out shadow-md ">
                <div className="w-full  rounded-xl overflow-hdden px-4 py-5 h-full flex items-center">
                  <div className="flex flex-wrap items-center">
                    <div className=" mb-4 grd-bg-pink text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink rounded-full">
                      <SmallApplaudIcon />
                    </div>
                    <div className="pl-3 max-w-full flex-grow flex-1 mb-2 ">
                      <div className="primary-color-blue font-semibold tracking-wide text-sm  mb-1 flex items-center">
                        Review Created
                        <span className="leading-[0] ml-2">
                          {CustomPopover("Count of Reviews Created by you.")}
                        </span>
                      </div>
                      <span className="text-2xl primary-color-blue font-semibold ">
                        {dashBoardData.reviewCreatedCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white grd-bg-pink-hover  transition-all duration-300 ease-in-out shadow-md ">
                <div className="w-full  rounded-xl overflow-hdden px-4 py-5  h-full flex items-center">
                  <div className="flex flex-wrap items-center border-gray-200 ">
                    <div className="mb-4 rounded-full text-white grid items-center w-10 h-10 py-1 px-1 justify-center grd-bg-pink">
                      <Image
                        src={"/media/images/reviewicon.png"}
                        alt="logo"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2  ">
                      <div className="primary-color-blue font-semibold tracking-wide text-sm mb-1 flex items-center">
                        Review Answered
                        <span className="leading-[0] ml-2">
                          {CustomPopover("Count of Reviews Answered by you.")}
                        </span>
                      </div>
                      <span className="text-2xl primary-color-blue font-semibold">
                        {dashBoardData.reviewAnsweredCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl grd-bg-pink-hover  transition-all duration-300 ease-in-out shadow-md ">
                <div className="w-full rounded-xl overflow-hdden  px-4 py-5 h-full flex items-center">
                  <div className="flex flex-wrap  border-gray-200 ">
                    <div className="grd-bg-pink  mb-4 rounded-full text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-purple ">
                      <Image
                        src={"/media/images/threeusers.png"}
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2  ">
                      <h5 className="primary-color-blue font-semibold tracking-wide text-sm mb-1 flex items-center">
                        Users
                        <span className="leading-[0] ml-2">
                          {CustomPopover(
                            "Count of Users in your organization."
                          )}
                        </span>
                      </h5>
                      <span className="text-2xl primary-color-blue font-semibold">
                        {dashBoardData.userCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 ">
              <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 mt-5 ">
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
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={12}>
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl mt-1 font-semibold primary-color-blue mb-2 flex items-center">
                      Applauds Leaderboard
                      <span className="leading-[0] ml-2">
                        {CustomPopover(
                          "Applauds count received by that member."
                        )}
                      </span>
                    </h2>

                    <Row>
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
                                              <p className="mb-2 primary-color-blue font-medium text-sm">
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
                            <div className="text-center  ">
                              No Applaud Found
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                  <div>
                    {allApplaud.length > 0 ? (
                      <Link href="/applaud/allapplaud">
                        <div className="primary-color-blue text-sm  cursor-pointer font-medium hover:underline  text-center mt-2">
                          View All
                        </div>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </Col>
              <Col md={12} lg={12} xs={24}>
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 h-full">
                  <h2 className="text-xl mt-1 primary-color-blue  font-semibold mb-2 flex items-center">
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
                                        <p className="mb-2 primary-color-blue font-medium text-sm">
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
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={7} className="h-full">
        <SiderRight dashBoardData={dashBoardData} />
      </Col>
    </Row>
  );
}

export default DashBoard;

import React, { useState, useEffect } from "react";
import { Col, Row } from "antd/lib/grid";
import Image from "next/image";
import threeUser from "../../assets/Icon/threeusers.png";
import ReviewIcon from "../../assets/Icon/reviewicon.png";
import User1 from "../../assets/images/User1.png";
import User2 from "../../assets/images/User2.png";
import User3 from "../../assets/images/User3.png";
import User4 from "../../assets/images/User4.png";
import dynamic from "next/dynamic";
import { SmallApplaudIcon, ApplaudIconSmall } from "../../assets/Icon/icons";
import { Skeleton } from "antd";

const SiderRight = dynamic(() => import("../SiderRight/SiderRight"), {
  ssr: false,
});

const BarChart = dynamic(() => import("../../helpers/Charts"), {
  ssr: false,
});

function DashBoard({ user }) {
  const [dashBoardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalRating, setTotalRating] = useState(0);

  async function fetchDashboardData() {
    setDashboardData([]);
    await fetch("/api/dashboard", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        role: user.role_id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          if (response.data.reviewRating.length > 0)
            ratingHandler(response.data.reviewRating);
          setDashboardData(response.data);
        }
      })
      .catch((err) => {
        setDashboardData([]);
      });
  }

  const ratingHandler = (data) => {
    let sum = 0;
    let total = data.map((item) => {
      if (item.ReviewAssigneeAnswers.length > 0) {
        let totalrating = item.ReviewAssigneeAnswers.reduce((prev, curr) => {
          if (curr?.ReviewAssigneeAnswerOption?.length > 0) {
            return (
              Number(prev) + Number(curr?.ReviewAssigneeAnswerOption[0].option)
            );
          } else return 0;
        }, sum);
        let averageRating =
          Number(totalrating) / Number(item?.ReviewAssigneeAnswers?.length);
        return averageRating;
      } else return 0;
    });
    let avgSum = 0;
    let avgRatingSum = total.reduce((prev, curr) => {
      return Number(prev) + Number(curr);
    }, avgSum);
    let avgRating = avgRatingSum / total.length;
    setTotalRating(Number(avgRating).toFixed(2));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Row className="pr-4">
      <Col sm={24} md={24} lg={17}>
        <div className="screen px-3 md:px-8 mt-6">
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grd-bg-pink-hover bg-white rounded-xl transition-all duration-300 ease-in-out shadow-md ">
                <div className="w-full  rounded-xl overflow-hdden px-4 py-5">
                  <div className="flex flex-wrap items-center">
                    <div className=" mb-4 grd-bg-pink text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink rounded-full">
                      <SmallApplaudIcon />
                    </div>
                    <div className="pl-3 max-w-full flex-grow flex-1 mb-2 ">
                      <div className="primary-color-blue font-semibold tracking-wide text-sm  mb-1">
                        Review Created
                      </div>
                      <span className="text-2xl primary-color-blue font-semibold ">
                        {dashBoardData.reviewCreated ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white grd-bg-pink-hover  transition-all duration-300 ease-in-out shadow-md ">
                <div className="w-full  rounded-xl overflow-hdden px-4 py-5  ">
                  <div className="flex flex-wrap items-center border-gray-200 ">
                    <div className="mb-4 rounded-full text-white grid items-center w-10 h-10 py-1 px-1 justify-center grd-bg-pink">
                      <Image
                        src={ReviewIcon}
                        alt="logo"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2  ">
                      <div className="primary-color-blue font-semibold tracking-wide text-sm mb-1 ">
                        Review Answered
                      </div>
                      <span className="text-2xl primary-color-blue font-semibold">
                        {dashBoardData.reviewAnswered ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl grd-bg-pink-hover  transition-all duration-300 ease-in-out shadow-md ">
                <div className="w-full rounded-xl overflow-hdden  px-4 py-5">
                  <div className="flex flex-wrap  border-gray-200 ">
                    <div className="grd-bg-pink  mb-4 rounded-full text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-purple ">
                      <Image
                        src={threeUser}
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2  ">
                      <h5 className="primary-color-blue font-semibold tracking-wide text-sm mb-1 ">
                        Users
                      </h5>
                      <span className="text-2xl primary-color-blue font-semibold">
                        {dashBoardData.userData ?? 0}
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
                  <BarChart />
                )}
              </div>
            </div>
            <Row className="mt-6 mx-5" gutter={[16, 16]}>
              <Col xs={24} md={12} lg={12}>
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 h-full">
                  <h2 className="text-xl mt-1 font-semibold primary-color-blue mb-2">
                    Applauds Leaderboard
                  </h2>
                  <Row>
                    <Col xs={24} md={12}>
                      <Row className="">
                        {dashBoardData?.applaudData?.length > 0 &&
                          dashBoardData?.applaudData.map((item) => (
                            <>
                              <Col xs={7} md={10}>
                                <div className="p-2 mt-2 flex justify-center">
                                  <Image src={User1} alt="user" />
                                </div>
                              </Col>
                              <Col xs={17} md={14}>
                                <div className="flex  justify-between items-center">
                                  <div className="py-2 px-3">
                                    <p className="mb-2 primary-color-blue font-medium text-sm">
                                      {item?.created?.first_name}
                                    </p>
                                    <p className="flex">
                                      <ApplaudIconSmall />
                                      <span className="pl-2 text-sm font-medium text-gray-500">
                                        0
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </Col>
                            </>
                          ))}
                      </Row>
                    </Col>
                    {/* <Col xs={24} md={12}>
                      <Row className="">
                        <Col xs={7} md={10}>
                          <div className="p-2 mt-2 flex justify-center">
                            <Image
                              src={User2}
                              alt="user "
                              // width={40}
                              // height={40}
                            />
                          </div>
                        </Col>
                        <Col xs={17} md={14}>
                          <div className="flex  justify-between items-center">
                            <div className="py-2 px-3">
                              <p className="mb-2 primary-color-blue font-medium text-sm">
                                Nishant Thakur
                              </p>
                              <p className="flex">
                                <ApplaudIconSmall />
                                <span className="pl-2 text-sm font-medium text-gray-500">
                                  0
                                </span>
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} md={12}>
                      <Row className="">
                        <Col xs={7} md={10}>
                          <div className="p-2 mt-2 flex justify-center">
                            <Image
                              src={User3}
                              alt="user "
                              // width={80}
                              // height={80}
                            />
                          </div>
                        </Col>
                        <Col xs={17} md={14}>
                          <div className="flex  justify-between items-center">
                            <div className="py-2 px-3">
                              <p className="mb-2 primary-color-blue font-medium text-sm">
                                Tanvi Rana
                              </p>
                              <p className="flex">
                                <ApplaudIconSmall />
                                <span className="pl-2 text-sm font-medium text-gray-500">
                                  0
                                </span>
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} md={12}>
                      <Row className="">
                        <Col xs={7} md={10}>
                          <div className="p-2 mt-2 flex justify-center">
                            <Image src={User4} alt="user " />
                          </div>
                        </Col>
                        <Col xs={17} md={14}>
                          <div className="flex  justify-between items-center">
                            <div className="py-2 px-3">
                              <p className="mb-2 primary-color-blue font-medium text-sm">
                                Annop Thakur
                              </p>
                              <p className="flex">
                                <ApplaudIconSmall />
                                <span className="pl-2 text-sm font-medium text-gray-500">
                                  0
                                </span>
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col> */}
                  </Row>
                </div>
              </Col>
              <Col md={12} lg={12}>
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 h-full">
                  <h2 className="text-xl mt-1 primary-color-blue  font-semibold mb-2">
                    Feedback Leaderboard
                  </h2>
                  <Row>
                    <Col xs={24} md={24}>
                      <Row className="my-3">
                        <Col xs={6} md={5}>
                          <Image
                            src={User1}
                            alt="user"
                            // width={40}
                            // height={40}
                          />
                        </Col>
                        <Col xs={18} md={19}>
                          <div className="px-2">
                            <p className="mb-2 primary-color-blue font-medium text-sm">
                              Ankush Thakur
                            </p>
                            <p className="flex justify-between">
                              <span className="text-sm font-medium text-gray-500">
                                Feeback Given : 0
                              </span>
                              <span className="pl-2 text-sm font-medium text-gray-500">
                                Feeback Received : 0
                              </span>
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    <Col xs={24} md={24}>
                      <Row>
                        <Col xs={6} md={5}>
                          <Image
                            src={User2}
                            alt="user "
                            // width={40}
                            // height={40}
                          />
                        </Col>
                        <Col xs={18} md={19}>
                          <div className="px-2">
                            <p className="mb-2 primary-color-blue font-medium text-sm">
                              Annop Thakur
                            </p>
                            <p className="flex justify-between">
                              <span className="text-sm font-medium text-gray-500">
                                Feeback Given : 0
                              </span>
                              <span className="pl-2 text-sm font-medium text-gray-500">
                                Feeback Received : 0
                              </span>
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={7} className="mt-6 h-full  ">
        <SiderRight data={dashBoardData} totalRating={totalRating} />
      </Col>
    </Row>
  );
}

export default DashBoard;

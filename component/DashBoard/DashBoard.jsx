import React, { useState, useEffect } from "react";
import { Col, Row } from "antd/lib/grid";
import Image from "next/image";
import threeUser from "../../assets/Icon/threeusers.png";
import ReviewIcon from "../../assets/Icon/reviewicon.png";
import UserIcon from "../../assets/images/User.png";
import dynamic from "next/dynamic";
import { SmallApplaudIcon, ApplaudIconSmall } from "../../assets/Icon/icons";

import { Skeleton } from "antd";

const SiderRight = dynamic(import("../SiderRight/SiderRight"), {
  ssr: false,
});

const BarChart = dynamic(import("../../helpers/Charts"), {
  ssr: false,
});

function DashBoard({ user }) {
  const [dashBoardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchDashboardData() {
    setDashboardData([]);
    await fetch("/api/dashboard", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        orgId: user.organization_id,
        role: user.role_id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setDashboardData(response.data);
        }
      })
      .catch((err) => {
        setDashboardData([]);
      });
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Row className="pr-4">
        <Col sm={24} md={24} lg={17}>
          <div className="screen px-3 md:px-8 mt-6">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grd-bg-pink-hover bg-white rounded-xl transition-all duration-300 ease-in-out ">
                  <div className="w-full  rounded-xl overflow-hdden px-4 py-5">
                    <div className="flex flex-wrap items-center   ">
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
                <div className="rounded-xl bg-white grd-bg-pink-hover  transition-all duration-300 ease-in-out ">
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

                <div className="bg-white rounded-xl grd-bg-pink-hover  transition-all duration-300 ease-in-out ">
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
              <div className="mt-12">
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
                    <h2 className="text-xl mt-1 font-semibold">
                      Applauds Leaderboard
                    </h2>
                    <Row>
                      <Col xs={24} md={12}>
                        <Row className="">
                          <Col xs={12} md={8}>
                            <div className="p-2 mt-2 flex justify-center">
                              <Image
                                src={UserIcon}
                                alt="user "
                                width={40}
                                height={40}
                              />
                            </div>
                          </Col>
                          <Col xs={12} md={16}>
                            <div className="flex  justify-between items-center">
                              <div className="py-2 px-3">
                                <p className="mb-2 primary-color-blue font-medium text-sm">
                                  Ankush thakur
                                </p>
                                <p className="flex">
                                  <ApplaudIconSmall />
                                  <span className="pl-2 text-sm font-medium">
                                    20
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} md={12}>
                        <Row className="">
                          <Col xs={12} md={8}>
                            <div className="p-2 mt-2 flex justify-center">
                              <Image
                                src={UserIcon}
                                alt="user "
                                width={40}
                                height={40}
                              />
                            </div>
                          </Col>
                          <Col xs={12} md={16}>
                            <div className="flex  justify-between items-center">
                              <div className="py-2 px-3">
                                <p className="mb-2 primary-color-blue font-medium text-sm">
                                  Nishant thakur
                                </p>
                                <p className="flex">
                                  <ApplaudIconSmall />
                                  <span className="pl-2 text-sm font-medium">
                                    20
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} md={12}>
                        <Row className="">
                          <Col xs={12} md={8}>
                            <div className="p-2 mt-2 flex justify-center">
                              <Image
                                src={UserIcon}
                                alt="user "
                                width={40}
                                height={40}
                              />
                            </div>
                          </Col>
                          <Col xs={12} md={16}>
                            <div className="flex  justify-between items-center">
                              <div className="py-2 px-3">
                                <p className="mb-2 primary-color-blue font-medium text-sm">
                                  Ajay thakur
                                </p>
                                <p className="flex">
                                  <ApplaudIconSmall />
                                  <span className="pl-2 text-sm font-medium">
                                    20
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} md={12}>
                        <Row className="">
                          <Col xs={12} md={8}>
                            <div className="p-2 mt-2 flex justify-center">
                              <Image
                                src={UserIcon}
                                alt="user "
                                width={40}
                                height={40}
                              />
                            </div>
                          </Col>
                          <Col xs={12} md={16}>
                            <div className="flex  justify-between items-center">
                              <div className="py-2 px-3">
                                <p className="mb-2 primary-color-blue font-medium text-sm">
                                  Annop thakur
                                </p>
                                <p className="flex">
                                  <ApplaudIconSmall />
                                  <span className="pl-2 text-sm font-medium">
                                    20
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col md={12} lg={12}>
                  <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 ">
                    <h2 className="text-xl mt-1  font-semibold">
                      Feedback Leaderboard
                    </h2>
                    <Row>
                      <Col xs={24} md={24}>
                        <div className="flex  items-center">
                          <div className="p-2 w-1/4 flex justify-center">
                            <Image
                              src={UserIcon}
                              alt="user "
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="py-2 px-3">
                            <p className="mb-2 primary-color-blue font-medium text-sm">
                              Ankush thakur
                            </p>
                            <p className="flex justify-between">
                              <span className="text-sm font-medium">
                                Feeback Given : 20
                              </span>
                              <span className="pl-2 text-sm font-medium">
                                Feeback Received : 10
                              </span>
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} md={24}>
                        <div className="flex  items-center">
                          <div className="p-2 w-1/4 flex justify-center">
                            <Image
                              src={UserIcon}
                              alt="user "
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="py-2 px-3">
                            <p className="mb-2 primary-color-blue font-medium text-sm">
                              Annop thakur
                            </p>
                            <p className="flex justify-between">
                              <span className="text-sm font-medium">
                                Feeback Given : 20
                              </span>
                              <span className="pl-2 text-sm font-medium">
                                Feeback Received : 10
                              </span>
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col sm={24} md={24} lg={7} className="mt-6 h-full ">
          <SiderRight data={dashBoardData} />
        </Col>
      </Row>
    </>
  );
}

export default DashBoard;

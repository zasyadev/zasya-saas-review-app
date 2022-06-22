import React, { useState, useEffect } from "react";
import { Col, Row } from "antd/lib/grid";
import Image from "next/image";
import threeUser from "../../assets/Icon/threeusers.png";
import ReviewIcon from "../../assets/Icon/reviewicon.png";
import BarChart from "../../helpers/BarChart";
// import Doughnut from "../../helpers/Doughnut";
import { LineChart } from "../../helpers/LineChart";
import dynamic from "next/dynamic";
// import HeaderLayout from "../layout/HeaderLayout";
// import SiderRight from "../SiderRight/siderRight";

const SiderRight = dynamic(import("../SiderRight/SiderRight"), {
  ssr: false,
});

function DashBoard({ user }) {
  const [dashBoardData, setDashboardData] = useState({});

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
        // setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setDashboardData([]);
      });
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <Row>
        <Col sm={24} md={24} lg={16}>
          <div className="screen px-3 md:px-8 mt-14">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 mb-4 ">
                <div className="px-4  mb-10">
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                    <div className="flex flex-wrap border-b border-gray-200 ">
                      <div className="bg-gradient-to-tr from-pink-500 to-pink-700  mb-4 rounded-xl text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink ">
                        <Image
                          src={ReviewIcon}
                          alt="logo"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="pl-3 max-w-full flex-grow flex-1 mb-2 text-right ">
                        <div className="text-gray-500 font-medium tracking-wide text-base mb-1">
                          Review Created
                        </div>
                        <span className="text-xl text-gray-900 ">
                          {dashBoardData.reviewCreated ?? 0}
                        </span>
                      </div>
                    </div>
                    {/* <div className="text-sm text-gray-700 pt-4 flex items-center  justify-between">
                     <span className="text-green-500 ml-1 mr-2">3.48</span>
                    <span className="font-light whitespace-nowrap">
                    Since last month
                    </span>
                    </div> */}
                  </div>
                </div>
                <div className="px-4 mb-10">
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                    <div className="flex flex-wrap border-b border-gray-200 ">
                      <div className="bg-gradient-to-tr from-orange-500 to-orange-700  mb-4 rounded-xl text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-orange ">
                        <Image
                          src={ReviewIcon}
                          alt="logo"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2 text-right ">
                        <h5 className="text-gray-500 font-medium tracking-wide text-base mb-1 ">
                          Review Answered
                        </h5>
                        <span className="text-xl text-gray-900">
                          {dashBoardData.reviewAnswered ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 mb-10">
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                    <div className="flex flex-wrap border-b border-gray-200 ">
                      <div className="bg-gradient-to-tr from-purple-500 to-purple-700  mb-4 rounded-xl text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-purple ">
                        <Image
                          src={threeUser}
                          alt="icon"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2 text-right ">
                        <h5 className="text-gray-500 font-medium tracking-wide text-base mb-1 ">
                          Users
                        </h5>
                        <span className="text-xl text-gray-900">
                          {dashBoardData.userData ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 ">
                  <BarChart />
                </div>
              </div>
              <Row className="mt-6 mx-5" gutter={16}>
                <Col md={12} lg={12}>
                  <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 ">
                    <h2 className="text-xl mt-1 font-semibold">
                      Applauds Leaderboard
                    </h2>
                  </div>
                </Col>
                <Col md={12} lg={12}>
                  <div className="w-full bg-white rounded-xl overflow-hidden shadow-md p-4 ">
                    <h2 className="text-xl mt-1  font-semibold">
                      Feedback Leaderboard
                    </h2>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col sm={24} md={24} lg={7} className="mt-6">
          <SiderRight />
        </Col>
      </Row>
    </>
  );
}

export default DashBoard;

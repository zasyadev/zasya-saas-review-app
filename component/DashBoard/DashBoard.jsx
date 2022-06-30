import React, { useState, useEffect } from "react";
import { Col, Row } from "antd/lib/grid";
import Image from "next/image";
import threeUser from "../../assets/Icon/threeusers.png";
import ReviewIcon from "../../assets/Icon/reviewicon.png";
import BarChart from "../../helpers/BarChart";
import { SmallApplaudIcon } from "../../assets/Icon/icons";
import dynamic from "next/dynamic";

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
              <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-4">
                <div className=" mb-10 grd-bg-pink rounded-xl">
                  <div className="w-full  rounded-xl overflow-hdden shadow-md px-4 py-5">
                    <div className="flex flex-wrap  border-gray-200 ">
                      <div className="bg-white  mb-4 text-black grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-pink rounded-full">
                        <SmallApplaudIcon />
                      </div>
                      <div className="pl-3 max-w-full flex-grow flex-1 mb-2 ">
                        <div className="text-white font-semibold tracking-wide text-sm  mb-1">
                          Review Created
                        </div>
                        <span className="text-xl text-white ">
                          {dashBoardData.reviewCreated ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mb-10">
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md px-4 py-5 ">
                    <div className="flex flex-wrap  border-gray-200 ">
                      <div className="grd-bg-pink  mb-4 rounded-full text-white grid items-center w-10 h-10 py-1 px-1 justify-center shadow-lg-orange ">
                        <Image
                          src={ReviewIcon}
                          alt="logo"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="w-full pl-3 max-w-full flex-grow flex-1 mb-2  ">
                        <h5 className="text-gray-500 font-semibold tracking-wide text-sm mb-1 ">
                          Review Answered
                        </h5>
                        <span className="text-xl text-gray-900">
                          {dashBoardData.reviewAnswered ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" mb-10">
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md px-4 py-5">
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
                        <h5 className="text-gray-500 font-semibold tracking-wide text-sm mb-1 ">
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
              <Row className="mt-6 mx-5" gutter={[16, 16]}>
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
        <Col sm={24} md={24} lg={7} className="mt-6 h-full ">
          <SiderRight data={dashBoardData} />
        </Col>
      </Row>
    </>
  );
}

export default DashBoard;

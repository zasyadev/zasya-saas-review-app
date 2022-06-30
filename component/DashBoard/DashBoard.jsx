import React, { useState, useEffect } from "react";
import { Col, Row } from "antd/lib/grid";
import Image from "next/image";
import threeUser from "../../assets/Icon/threeusers.png";
import ReviewIcon from "../../assets/Icon/reviewicon.png";
// import BarChart from "../../helpers/BarChart";
import { SmallApplaudIcon } from "../../assets/Icon/icons";
import dynamic from "next/dynamic";
// import { BarChart } from "../../helpers/Charts";

const SiderRight = dynamic(import("../SiderRight/SiderRight"), {
  ssr: false,
});

const BarChart = dynamic(import("../../helpers/Charts"), {
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

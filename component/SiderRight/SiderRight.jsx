import { Col, Row } from "antd";
import { StarOutlined, LikeOutlined } from "@ant-design/icons";
import React from "react";
import LineChart from "../../helpers/LineChart";
import { DoughnutChart } from "../../helpers/DoughnutChart";
import { ApplaudIcon, StarIcon } from "../../assets/Icon/icons";

// import dynamic from "next/dynamic";

function SiderRight({ data }) {
  return (
    <>
      <Row
        className=" bg-white rounded-xl shadow-md py-8 px-4"
        justify="space-around"
      >
        <Col sm={12} md={12} lg={12} className="border-r border-slate-200">
          <div className=" flex flex-col items-center justify-center">
            <div>
              <ApplaudIcon />
            </div>
            <div>
              <p className="text-xl font-extrabold my-2">
                {data?.applaudData?.length ?? 0}
              </p>
            </div>
          </div>
        </Col>
        <Col sm={12} md={12} lg={12}>
          <div className=" flex flex-col items-center justify-center">
            <div>
              <StarIcon />
            </div>
            <div>
              <p className="text-xl font-extrabold my-2">18.5</p>
            </div>
          </div>
        </Col>
      </Row>
<<<<<<< HEAD
      <Row>
        <div className="w-full bg-white rounded-xl shadow-md px-4 py-4 mt-8 ">
          <p className="text-lg font-bold mb-4 primary-color-blue">
            Feedback given to me
          </p>
=======
      <Row className="mx-2">
        <div className="w-full bg-white rounded-xl shadow-md px-4 py-6 mt-8 ">
>>>>>>> 495e89778e273d2e1a84d7a6d8b96f8051a90be5
          <LineChart />
        </div>
      </Row>
      {/* <DoughnutChart /> */}
    </>
  );
}

export default SiderRight;

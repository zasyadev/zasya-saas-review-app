import { Col, Row } from "antd";
import { StarOutlined, LikeOutlined } from "@ant-design/icons";
import React from "react";
import LineChart from "../../helpers/LineChart";
import { DoughnutChart } from "../../helpers/DoughnutChart";
import { ApplaudIcon, StarIcon } from "../../assets/Icon/icons";

// import dynamic from "next/dynamic";

function SiderRight({ data }) {
  return (
    <div className="mx-3 md:mx-0">
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
              <p className="text-xl font-extrabold my-2">8.5</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="">
        <div className="w-full bg-white rounded-xl shadow-md px-4 py-4 mt-8 ">
          <p className="text-lg font-bold mb-4 primary-color-blue">
            Feedback given to me
          </p>
          <LineChart />
        </div>
      </Row>
      {/* <DoughnutChart /> */}
    </div>
  );
}

export default SiderRight;

import { Col, Row } from "antd";
import { StarOutlined } from "@ant-design/icons";
import React from "react";
import { LineChart } from "../../helpers/LineChart";
import { DoughnutChart } from "../../helpers/DoughnutChart";

// import dynamic from "next/dynamic";

function SiderRight() {
  "";
  return (
    <>
      <Row className=" bg-white rounded-xl  shadow-md ">
        <Col lg={12}>
          <div className="text-center my-6">
            <StarOutlined className="rightsidebar-icon" />
          </div>
        </Col>
        <Col lg={12}>
          <div className="text-center my-6">
            <StarOutlined className="rightsidebar-icon" />
          </div>
        </Col>
      </Row>
      <Row>
        <div className="w-full bg-white rounded-xl shadow-md py-4 mt-4 ">
          <LineChart />
        </div>
      </Row>
      {/* <DoughnutChart /> */}
    </>
  );
}

export default SiderRight;

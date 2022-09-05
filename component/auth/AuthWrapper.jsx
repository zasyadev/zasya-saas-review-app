import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";

function AuthWrapper({ FormComponent, heading }) {
  return (
    <Row className="h-full" align="stretch">
      <Col xs={24} md={12} lg={12}>
        <div className="py-6 px-4 md:px-8 lg:px-16 h-full flex items-center justify-center overflow-y-auto no-scrollbar">
          <div className="w-full flex flex-col justify-center max-w-xl">
            <div className="login-top-image"></div>
            <h2 className="text-2xl xl:text-3xl text-primary font-bold uppercase mb-6 md:mb-8">
              {heading}
            </h2>
            <FormComponent />
            <div className="login-bottom-image"></div>
          </div>
        </div>
      </Col>
      <Col xs={24} md={12} lg={12} className="hidden md:block">
        <div className="login-image-wrapper hidden md:grid place-content-center h-full">
          <div className="relative image-wrapper">
            <Image
              src={"/media/images/bg/login_img.webp"}
              alt="login"
              layout="fill"
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default AuthWrapper;

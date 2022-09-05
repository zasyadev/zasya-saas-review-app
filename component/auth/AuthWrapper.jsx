import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";

function AuthWrapper({ FormComponent, heading }) {
  return (
    <Row>
      <Col
        xs={24}
        md={12}
        lg={12}
        className="justify-center items-center register-wrapper"
      >
        <div className="w-full  py-6 md:mb-0 px-8 lg:px-16 flex flex-col justify-center h-screen  overflow-auto">
          <div className="h-full px-4">
            <div className="login-top-image"></div>
            <h2 className="login-heading">{heading}</h2>
            <FormComponent />
            <div className="login-bottom-image"></div>
          </div>
        </div>
      </Col>
      <Col xs={24} md={12} lg={12}>
        <div className="login-image-wrapper hidden md:grid place-content-center ">
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

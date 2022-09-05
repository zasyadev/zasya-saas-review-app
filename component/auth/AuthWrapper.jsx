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
        className="  justify-center items-center register-wrapper"
      >
        <div className="w-full py-8 md:mb-0 px-8 flex flex-col justify-center md:px-20  ">
          <div className="login-top-image"></div>
          <h2 className="login-heading">{heading}</h2>
          <FormComponent />
          <div className="login-bottom-image"></div>
        </div>
      </Col>
      <Col xs={24} md={12} lg={12}>
        <div className="login-image-wrapper justify-center items-center hidden md:flex">
          <div className="flex justify-center items-center h-screen relative">
            <div className="w-11/12 h-auto">
              <Image
                src={"/media/images/bg/login_img.webp"}
                alt="login"
                layout="fill"
              />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default AuthWrapper;

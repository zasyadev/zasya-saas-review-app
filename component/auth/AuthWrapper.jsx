import { Col, Row } from "antd";
import Image from "next/image";
import React from "react";
import loginImage from "../../assets/images/login_img.png";

function AuthWrapper({ FormComponent, heading }) {
  return (
    <Row>
      <Col
        xs={24}
        md={12}
        lg={12}
        className="  justify-center items-center register-wrapper"
      >
        {/* <div className=" text-gray-800"> */}
        {/* <div className="flex  md:justify-between justify-center items-center flex-wrap h-full g-6"> */}
        {/* <div className=" w-full py-8 md:mb-0 px-8 md:px-20 relative flex flex-col justify-center md:h-screen"> */}
        <div className="w-full py-8 md:mb-0 px-8 flex flex-col justify-center md:px-20  ">
          <div className="login-top-image"></div>
          <h2 className="login-heading">{heading}</h2>
          <FormComponent />
          <div className="login-bottom-image"></div>
        </div>
        {/* </div> */}
        {/* </div> */}
      </Col>
      <Col
        xs={24}
        md={12}
        lg={12}
        className="login-image-wrapper justify-center items-center hidden md:flex"
      >
        {/* <div className="md:w-1/2 w-full mb-12 md:mb-0 h-screen"> */}

        <div className="login-image-wrapper flex justify-center items-center h-screen">
          <Image src={loginImage} alt="login" className="h-screen" />
        </div>

        {/* </div> */}
      </Col>
    </Row>
  );
}

export default AuthWrapper;

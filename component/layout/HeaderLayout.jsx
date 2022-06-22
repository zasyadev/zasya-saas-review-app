import React from "react";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
import Image from "next/image";
import User from "../../assets/images/User.png";
import { Button, Col, Layout, Row } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";

const { Header } = Layout;

function HeaderLayout({ title, pageName }) {
  const router = useRouter();
  const logoutHandler = () => {
    signOut({
      redirect: false,
    });
    router.replace("/");
  };
  return (
    <Header
      className="bg-indigo-100 border-2 border-b-black "
      style={{
        padding: 0,
      }}
    >
      <Row>
        <Col lg={16}>
          <div className="text-lg font-bold mx-6 mt-3">{title} </div>
        </Col>
        <Col lg={8}>
          <div className="flex items-end justify-end mt-4 mx-3">
            <Image src={User} alt="user" width={38} height={38} />

            <Button
              className="text-black bg-white text-center justify-center ml-4 rounded-md  "
              onClick={() => logoutHandler()}
            >
              Logout
              {/* <span
                onClick={() => logoutHandler()}
                className=" cursor-pointer text-white text-sm tracking-wider   "
              >
                 <LogoutOutlined /> 
              </span> */}
            </Button>
          </div>
        </Col>
      </Row>

      {/* <div className="px-4 flex item justify-start ">
        <div>{title} </div>
        <div className="">
          <span
            onClick={() => setCollapsed(!collapsed)}
            className=" cursor-pointer text-white text-lg"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="sidebar-icon" />
            ) : (
              <MenuFoldOutlined className="sidebar-icon" />
            )}
          
          </span>
        </div> 

        <div className="flex items-end justify-end">
          <div className="flex items-center justify-between mt-3">
            <Image src={User} alt="user" width={38} height={38} />

            <Button
              className="text-black bg-white text-center justify-center ml-4 rounded-md "
              onClick={() => logoutHandler()}
            >
              Logout
               <span
              onClick={() => logoutHandler()}
              className=" cursor-pointer text-white text-sm tracking-wider   "
            >
              <LogoutOutlined />
            </span> 
            </Button>
          </div>
        </div>
      </div> */}
    </Header>
  );
}

export default HeaderLayout;

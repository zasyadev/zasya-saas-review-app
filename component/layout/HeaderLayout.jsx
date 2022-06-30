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
    <Header className="bg-color-grey border-b border-b-neutral-300 p-0">
      <Row>
        <Col md={18} xs={12}>
          <div className=" font-bold mx-3 md:mx-6 mt-3 text-lg">{title} </div>
        </Col>
        <Col md={6} xs={12}>
          <div className="flex  justify-end  ">
            <div className="mx-4 mt-3 hidden md:block">
              <Image src={User} alt="user" width={38} height={38} />
            </div>
            <div className=" mx-2 md:mx-4 ">
              <button
                className="primary-bg-btn text-white text-sm py-2 text-center  px-2 md:px-4 rounded-md "
                onClick={() => logoutHandler()}
              >
                Logout
              </button>
            </div>
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

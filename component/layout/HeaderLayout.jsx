import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import User from "../../assets/images/User.png";
import { Button, Layout } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";

const { Header } = Layout;

function HeaderLayout({ setCollapsed, collapsed, pageName }) {
  const router = useRouter();
  const logoutHandler = () => {
    signOut({
      redirect: false,
    });
    router.replace("/");
  };
  return (
    <Header
      className="bg-gradient-to-r from-cyan-500 to-blue-500"
      style={{
        padding: 0,
      }}
    >
      <div className="px-4 flex justify-between">
        <div>
          <span
            onClick={() => setCollapsed(!collapsed)}
            className=" cursor-pointer text-white"
          >
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "20px" }} />
            )}
            <span className="uppercase text-white text-sm tracking-wider mt-3 px-4">
              {pageName}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <Image src={User} alt="user" width={40} height={35} />

          <Button
            className="text-white text-center justify-center ml-4 "
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
      </div>
    </Header>
  );
}

export default HeaderLayout;

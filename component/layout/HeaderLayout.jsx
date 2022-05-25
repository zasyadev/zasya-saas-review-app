import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
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
        <span
          onClick={() => setCollapsed(!collapsed)}
          className=" cursor-pointer text-white"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          <span className="uppercase text-white text-sm tracking-wider mt-3 px-4">
            {pageName}
          </span>
        </span>
        <span
          onClick={() => logoutHandler()}
          className=" cursor-pointer uppercase text-white text-sm tracking-wider mt-3 px-4"
        >
          <LogoutOutlined />
        </span>
      </div>
    </Header>
  );
}

export default HeaderLayout;

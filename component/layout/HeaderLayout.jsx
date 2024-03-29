import {
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { useRouter } from "next/router";
import React from "react";
import HeaderSearchBox from "./components/HeaderSearchBox";
import UserProfileHeader from "./components/UserProfileHeader";

const { Header } = Layout;

function HeaderLayout({ isBack, user, collapsed, setCollapsed }) {
  const router = useRouter();

  return (
    <Header className=" bg-white border-b border-b-neutral-300 p-0 md:sticky top-0 w-full z-50">
      <div className="flex items-center h-full justify-between mx-4 md:mx-6">
        <div className="flex items-center">
          {isBack && (
            <div
              className=" bg-white  grid place-content-center  cursor-pointer transition-all  duration-300 hover:bg-gray-100 rounded-full w-11 h-11 mr-3"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeftOutlined className="text-xl text-gray-600 hover:text-primary " />
            </div>
          )}

          <HeaderSearchBox user={user} />
        </div>
        <div className="flex justify-between items-center space-x-2 md:space-x-4">
          <UserProfileHeader user={user} />

          <div
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 py-2 px-3 bg-white grid place-content-center rounded-md cursor-pointer lg:hidden"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="text-lg" />
            ) : (
              <MenuFoldOutlined className="text-lg" />
            )}
          </div>
        </div>
      </div>
    </Header>
  );
}

export default HeaderLayout;

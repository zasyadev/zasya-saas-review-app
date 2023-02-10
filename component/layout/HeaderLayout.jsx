import {
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { useRouter } from "next/router";
import React from "react";
import UserProfileHeader from "./components/UserProfileHeader";

const { Header } = Layout;

function HeaderLayout({ isBack, title, user, collapsed, setCollapsed, lg }) {
  const router = useRouter();

  return (
    <Header className=" bg-white border-b border-b-neutral-300 p-0">
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

          <p className="font-bold text-lg md:text-2xl text-primary  max-w-xs lg:max-w-sm single-line-clamp mb-0">
            {title}
          </p>
        </div>
        <UserProfileHeader user={user} />
        {!lg ? (
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 py-2 px-3 bg-white grid place-content-center rounded-md cursor-pointer"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="text-lg" />
            ) : (
              <MenuFoldOutlined className="text-lg" />
            )}
          </div>
        ) : null}
      </div>
    </Header>
  );
}

export default HeaderLayout;

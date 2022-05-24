import React from "react";
import {
  MailOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function SiderLayout() {
  const items = [
    getItem("DashBoard", "Dashboard", <MailOutlined />),
    getItem("Activity", "Activity", <AppstoreOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
    ]),
    getItem("Team", "Team", <SettingOutlined />, [
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),
  ];

  const onClick = (e) => {
    console.log("click ", e);
  };
  return (
    <div className="h-screen fixed top-0 md:left-0 -left-64 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-72 z-10 py-4 px-6 transition-all duration-300">
      <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
        <Link
          href="/dashboard"
          className="mt-2 text-center w-full inline-block"
        >
          <h6 className="text-gray-900 text-xl font-serif font-bold leading-normal mt-0 mb-2">
            Dashboard
          </h6>
        </Link>
        {/* <Button>Button</Button> */}
        <div className="flex flex-col">
          <hr className="my-4 min-w-full" />
          <Menu
            onClick={onClick}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="vertical"
            items={items}
            className="dashboard-sider"
          />
        </div>
      </div>
    </div>
  );
}

export default SiderLayout;

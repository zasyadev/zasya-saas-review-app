import {
  CrownOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LikeOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { Grid, Layout } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import { URLS } from "../../constants/urls";
import HeaderLayout from "./HeaderLayout";
import SiderLayout from "./SiderLayout";
import clsx from "clsx";

const { useBreakpoint } = Grid;
const { Content, Footer } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function AdminLayout({
  user,
  title,
  isBack = false,
  children,
  isHeader = true,
}) {
  const { lg } = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (lg) setCollapsed(false);
    else setCollapsed(true);
  }, [lg]);

  const allMenus = [
    getItem(
      "Dashboard",
      URLS.DASHBOARD,
      <DashboardOutlined className="sidebar-icon" />
    ),

    getItem(
      "Reviews",
      URLS.REVIEW_CREATED,
      <FileTextOutlined className="sidebar-icon " />
    ),

    getItem("Goals", URLS.GOAL, <CrownOutlined className="sidebar-icon " />),
    getItem(
      "Follow Ups",
      URLS.FOLLOW_UP,
      <UsergroupAddOutlined className="sidebar-icon " />
    ),
    getItem(
      "Applaud",
      URLS.APPLAUD,
      <LikeOutlined className="sidebar-icon " />
    ),
    getItem(
      "Surveys",
      URLS.SURVEY,
      <FileUnknownOutlined className="sidebar-icon " />
    ),
    getItem(
      "Settings",
      "setting",
      <SettingOutlined className="sidebar-icon " />,
      [
        getItem("Templates", URLS.TEMPLATE),
        getItem("Profile ", URLS.PROFILE),
        getItem("Users", URLS.USERS),
        getItem("Teams", URLS.TEAMS),
      ]
    ),
  ];

  const filteredMenus = useMemo(() => {
    if (user?.role_id !== 4) {
      return allMenus;
    } else {
      return allMenus.map((item) =>
        item?.children && item?.children?.length > 0
          ? {
              ...item,
              children: item?.children.filter(
                (child) => child.label !== "Teams" && child.label !== "Users"
              ),
            }
          : item
      );
    }
  }, [user]);

  return (
    <>
      <HeadersComponent />
      <Layout className="h-screen">
        <SiderLayout
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          items={filteredMenus}
          lg={lg}
          user={user}
        />
        <Layout className="lg:ml-60 h-screen">
          <HeaderLayout
            isBack={isBack}
            title={title}
            user={user}
            setCollapsed={setCollapsed}
            collapsed={collapsed}
          />
          <Content className="bg-brandGray-200 dashboard-screen overflow-auto custom-scrollbar">
            <div className={clsx({ "p-4 md:p-6": isHeader })}>{children}</div>
          </Content>
          <Footer className="text-center bg-primary-gray p-3 font-medium border-t ">
            Desk Chime © 2023 Created By Zasya Solution
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default AdminLayout;

import {
  UserOutlined,
  DashboardOutlined,
  FormOutlined,
  LikeOutlined,
  SettingOutlined,
  FileTextOutlined,
  CrownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Grid, Layout } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import HeaderLayout from "./HeaderLayout";
import SiderLayout from "./SiderLayout";

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

function AdminLayout({ user, title, isBack = false, children }) {
  const { lg } = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (lg) setCollapsed(false);
    else setCollapsed(true);
  }, [lg]);

  const allMenus = [
    getItem(
      "Dashboard",
      "/dashboard",
      <DashboardOutlined className="sidebar-icon" />
    ),

    getItem(
      "Reviews",
      "/review/received",
      <FormOutlined className="sidebar-icon " />
    ),
    getItem("Users", "/users", <UserOutlined className="sidebar-icon " />),
    getItem("Teams", "/teams", <TeamOutlined className="sidebar-icon " />),

    getItem("Applaud", "/applaud", <LikeOutlined className="sidebar-icon " />),
    getItem(
      "Surveys",
      "/survey",
      <FileTextOutlined className="sidebar-icon " />
    ),
    getItem("Goals", "/goals", <CrownOutlined className="sidebar-icon " />),

    getItem(
      "Settings",
      "setting",
      <SettingOutlined className="sidebar-icon " />,
      [getItem("Templates", "/template"), getItem("Profile ", "/profile ")]
    ),
  ];

  const filteredMenus = useMemo(() => {
    if (user?.role_id !== 4) {
      return allMenus;
    } else {
      return allMenus.filter(
        (item) => item.label !== "Teams" && item.label !== "Users"
      );
    }
  }, [user]);

  return (
    <>
      <HeadersComponent />
      <Layout>
        <SiderLayout
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          items={filteredMenus}
          lg={lg}
        />
        <Layout className="min-h-screen">
          <Content className="bg-primary-gray ">
            <HeaderLayout
              isBack={isBack}
              title={title}
              user={user}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              lg={lg}
            />
            <div className="p-4 md:p-6">{children}</div>
          </Content>
          <Footer className="text-center bg-white p-3 font-medium text-primary">
            Review App © 2022 Created By Zasya Solution
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default AdminLayout;

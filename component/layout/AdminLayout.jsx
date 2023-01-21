import {
  DashboardOutlined,
  FormOutlined,
  LikeOutlined,
  SettingOutlined,
  FileTextOutlined,
  CrownOutlined,
  UsergroupAddOutlined,
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

    getItem("Applaud", "/applaud", <LikeOutlined className="sidebar-icon " />),
    getItem(
      "Surveys",
      "/survey",
      <FileTextOutlined className="sidebar-icon " />
    ),
    getItem("Goals", "/goals", <CrownOutlined className="sidebar-icon " />),
    getItem(
      "Follow Ups",
      "/followups",
      <UsergroupAddOutlined className="sidebar-icon " />
    ),

    getItem(
      "Settings",
      "setting",
      <SettingOutlined className="sidebar-icon " />,
      [
        getItem("Templates", "/template"),
        getItem("Profile ", "/profile "),
        getItem("Users", "/users"),
        getItem("Teams", "/teams"),
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

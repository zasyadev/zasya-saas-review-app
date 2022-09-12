import {
  AppstoreOutlined,
  DashboardOutlined,
  FormOutlined,
  LikeOutlined,
  SettingOutlined,
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

function AdminLayout({ user, title, children }) {
  const { md } = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (md) setCollapsed(false);
    else setCollapsed(true);
  }, [md]);

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

    getItem(
      "Team",
      "/team/members",
      <AppstoreOutlined className="sidebar-icon " />
    ),
    getItem("Applaud", "/applaud", <LikeOutlined className="sidebar-icon " />),

    getItem(
      "Settings",
      "setting",
      <SettingOutlined className="sidebar-icon " />,
      [getItem("Templates", "/template"), getItem("Profile ", "/profile ")]
    ),
  ];

  const filteredMenus = useMemo(() => {
    if (user.role_id !== 4) {
      return allMenus;
    } else {
      return allMenus.filter((item) => item.label !== "Team");
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
          md={md}
        />
        <Layout>
          <Content className="bg-color-dashboard ">
            <HeaderLayout
              title={title}
              user={user}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              md={md}
            />
            <div className="p-3 md:p-6">{children}</div>
          </Content>
          <Footer className="text-center bg-color-dashboard">
            Review App ©2022 Created by Zasya Solution
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default AdminLayout;

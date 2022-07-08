import {
  AppstoreOutlined,
  DashboardOutlined,
  FormOutlined,
  LikeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Grid, Layout } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { HeadersComponent } from "../../helpers/HeadersComponent";
import HeaderLayout from "./HeaderLayout";
import SiderLayout from "./SiderLayout";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function AdminLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();
  useEffect(() => {
    if (md) setCollapsed(false);
    else setCollapsed(true);
  }, [md]);

  const items = [
    getItem(
      "DashBoard",
      "/dashboard",
      <DashboardOutlined className="sidebar-icon" />
    ),
    // getItem("Activity", "sub1", <SettingOutlined />, [
    //   getItem("Submenu", "sub3", null, [
    //     getItem("Option 7", "7"),
    //     getItem("Option 8", "8"),
    //   ]),
    // ]),
    getItem(
      "Reviews",
      "/review/management",
      <FormOutlined className="sidebar-icon " />
    ),
    // getItem("Team", "team", <AppstoreOutlined className="sidebar-icon" />, [
    //   getItem("Groups", "/admin/team/groups"),
    //   getItem("Members", "/admin/team/members"),
    // ]),
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
      [
        // getItem("Templates", "/admin/template "),
        // getItem("Users", "/admin/user"),
        getItem("Templates", "/template"),
        getItem("Profile ", "/profile "),
      ]
    ),
  ];

  return (
    <Fragment>
      <HeadersComponent />
      <Layout>
        <SiderLayout
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          items={items}
          // setTitle={setTitle}
        />
        <Layout>
          <Content className="bg-color-dashboard ">
            {/* <HeaderLayout /> */}
            <HeaderLayout title={props.title} />
            {props.children}
          </Content>
          <Footer className="text-center bg-color-dashboard">
            Review App ©2021 Created by Zasya Solution
          </Footer>
        </Layout>
      </Layout>
    </Fragment>
  );
}

export default AdminLayout;

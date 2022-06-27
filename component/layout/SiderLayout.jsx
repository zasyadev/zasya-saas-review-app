import React, { useState, useEffect } from "react";

import { Menu, Layout } from "antd";
import { useRouter } from "next/router";
import Head from "next/head";

const { Sider } = Layout;

function SiderLayout({ collapsed, setCollapsed, items, setTitle }) {
  const router = useRouter();

  useEffect(() => {
    let label = items.find((item) => item.key === router.pathname);

    if (label) {
      setTitle(label.label);
    }
  }, [router]);

  // const items = [
  //   getItem(
  //     "DashBoard",
  //     "/admin/dashboard",
  //     <DashboardOutlined className="sidebar-icon" />
  //   ),
  //   // getItem("Activity", "sub1", <SettingOutlined />, [
  //   //   getItem("Submenu", "sub3", null, [
  //   //     getItem("Option 7", "7"),
  //   //     getItem("Option 8", "8"),
  //   //   ]),
  //   // ]),
  //   getItem(
  //     "Reviews",
  //     "/admin/review/management",
  //     <FormOutlined className="sidebar-icon " />
  //   ),
  //   // getItem("Team", "team", <AppstoreOutlined className="sidebar-icon" />, [
  //   //   getItem("Groups", "/admin/team/groups"),
  //   //   getItem("Members", "/admin/team/members"),
  //   // ]),
  //   getItem(
  //     "Team",
  //     "/admin/team/members",
  //     <AppstoreOutlined className="sidebar-icon " />
  //   ),
  //   getItem(
  //     "Applaud",
  //     "/admin/applaud",
  //     <LikeOutlined className="sidebar-icon " />
  //   ),
  //   getItem(
  //     "Templates",
  //     "/admin/template ",
  //     <FileOutlined className="sidebar-icon" />
  //   ),

  //   getItem(
  //     "Settings",
  //     "setting",
  //     <SettingOutlined className="sidebar-icon " />,
  //     [
  //       // getItem("Templates", "/admin/template "),
  //       // getItem("Users", "/admin/user"),
  //       getItem("Profile ", "/admin/profile "),
  //     ]
  //   ),
  // ];

  const onClickSideTab = (e) => {
    if (e.key.includes("/")) {
      router.replace(e.key);
    }
  };
  return (
    <Sider
      // trigger={null}
      collapsible
      collapsed={collapsed}
      className="sider min-h-screen"
      onCollapse={(value) => setCollapsed(value)}
      // collapsedWidth={0}
    >
      <Head>
        <title>Review App</title>
        <meta name="description" content="Generated by next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
        <a className="mt-3 text-center w-full inline-block">
          <h1 className="text-white first-line: text-xl font-serif font-bold leading-normal mt-0 mb-1">
            Review App
          </h1>
        </a>

        <div className=" flex flex-col py-4 px-2">
          <hr className=" min-w-full" />
          <Menu
            onClick={onClickSideTab}
            mode="inline"
            defaultSelectedKeys={router?.pathname}
            className="dashboard-sider border-0 gap-2 text-sm font-light rounded-lg bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md "
            items={items}
          />
        </div>
      </div>
    </Sider>
  );
}

export default SiderLayout;

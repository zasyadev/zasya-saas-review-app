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
      className="sider min-h-screen "
      onCollapse={(value) => setCollapsed(value)}
      // collapsedWidth={0}
      width={250}
    >
      <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
        <a className="mt-3 text-center w-full inline-block">
          <h1 className="text-white first-line: text-xl  font-bold leading-normal mt-0 mb-1">
            Review App
          </h1>
        </a>

        <div className=" flex flex-col py-4 px-2">
          <Menu
            onClick={onClickSideTab}
            mode="inline"
            defaultSelectedKeys={router?.pathname}
            className="dashboard-sider border-0 gap-3 rounded-lg  text-white px-2"
            items={items}
          />
        </div>
      </div>
    </Sider>
  );
}

export default SiderLayout;

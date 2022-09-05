import React from "react";
import { Menu, Layout } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

const { Sider } = Layout;

function SiderLayout({ collapsed, setCollapsed, items, md }) {
  const router = useRouter();

  const onClickSideTab = (e) => {
    if (e.key.includes("/")) {
      router.push(e.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsedWidth={md ? "80" : "0"}
      collapsed={collapsed}
      className="sider min-h-screen "
      onCollapse={(value) => setCollapsed(value)}
      width={250}
    >
      <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative">
        <Link href="/dashboard">
          <div className="mt-3 text-center w-full inline-block cursor-pointer px-3">
            <Image
              src={"/media/images/logos/review.png"}
              width={100}
              height={50}
            />
          </div>
        </Link>

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

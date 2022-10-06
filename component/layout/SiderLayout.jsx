import { Layout, Menu } from "antd";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

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
        <Link href="/dashboard" passHref>
          <div className="h-28 2xl:h-32 grid place-content-center text-center w-full cursor-pointer px-3">
            <Image
              src={"/media/images/logos/review.png"}
              width={100}
              height={51}
              alt="review logo"
            />
          </div>
        </Link>

        <div className="px-2">
          <Menu
            onClick={onClickSideTab}
            mode="inline"
            defaultSelectedKeys={router?.pathname}
            className="dashboard-sider border-0 gap-3 rounded-md  text-white px-2"
            items={items}
          />
        </div>
      </div>
    </Sider>
  );
}

export default SiderLayout;

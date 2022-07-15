import React from "react";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import User from "../../assets/images/User.png";
import { Button, Col, Dropdown, Layout, Menu, Row } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
// import { BellIcon, SearchIcon } from "../../assets/Icon/icons";

const { Header } = Layout;

function HeaderLayout({ title, pageName, user }) {
  const router = useRouter();
  const logoutHandler = () => {
    signOut({
      redirect: false,
    });
    router.push("/");
  };
  const menu = (
    <Menu
      items={[
        {
          key: "account",
          label: (
            <Link href="/profile">
              <div className="flex items-center my-auto">
                {" "}
                <UserOutlined /> <span className="span-text">My Account</span>
              </div>
            </Link>
          ),
        },

        {
          key: "logout",
          label: (
            <div
              onClick={() => logoutHandler()}
              className=" flex items-center "
            >
              <LogoutOutlined /> <span className="span-text">Sign Out</span>
            </div>
          ),
        },
      ]}
    />
  );
  const createMenu = (
    <Menu
      items={[
        {
          key: "review",
          label: <Link href="/review/add">Review</Link>,
        },
        {
          key: "template",
          label: <Link href="/template/add">Template</Link>,
        },
        {
          key: "applaud",
          label: <Link href="/applaud/add">Applaud</Link>,
        },
      ]}
    />
  );
  return (
    <Header className="ant-header bg-color-dashboard border-b border-b-neutral-300 p-0">
      <Row className="items-center h-full">
        <Col md={16} xs={12}>
          <div className="flex justify-between items-center mt-2">
            <div className=" font-bold mx-3 md:mx-6 text-2xl primary-color-blue">
              {title}
            </div>
          </div>
        </Col>
        <Col md={3} xs={12} className="hidden md:block">
          <div className="hidden md:flex items-center justify-between px-3">
            <Dropdown overlay={createMenu} trigger={["click"]}>
              <button
                key="create"
                type="default"
                className="primary-bg-btn text-white text-sm py-3  px-5 rounded flex  items-center  "
              >
                <span className="mr-2">Create</span> <DownOutlined />
              </button>
            </Dropdown>
          </div>
        </Col>
        <Col md={5} xs={12} className="pr-3">
          <Dropdown
            trigger={"click"}
            overlay={menu}
            overlayClassName="logout-dropdown "
            placement="bottomRight"
          >
            <div className=" flex items-center user-menu-wrapper py-1 px-4 cursor-pointer rounded-md">
              <div className="rounded-md flex justify-between mr-3 ">
                <Image src={User} alt="user" width={38} height={38} />
              </div>
              <div>
                <p className="user-deatils">{user?.first_name}</p>
              </div>
            </div>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}

export default HeaderLayout;

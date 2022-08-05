import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DownOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import User from "../../assets/images/User.png";
import { Avatar, Col, Dropdown, Layout, Menu, Row } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../helpers/notification";

const { Header } = Layout;

function HeaderLayout({
  title,
  pageName,
  user,
  fetchUserData,
  userOrganizationData,
  collapsed,
  setCollapsed,
  md,
}) {
  const router = useRouter();
  const logoutHandler = () => {
    signOut();
    router.push("/auth/login");
  };

  const changeOragnizationHandle = async (values) => {
    await fetch("/api/user/changeOrgId/" + user.id, {
      method: "POST",
      body: JSON.stringify({ org_id: values }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          fetchUserData();
          openNotificationBox("success", response.message, 3);
          router.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, []);

  const userMenu = (
    <Menu>
      <div className="flex my-2 mx-2" key={"accountName"}>
        <div className="flex mx-2 px-2">
          <div className="rounded-full">
            <Image
              src={
                userOrganizationData?.userImage
                  ? "/media/profile/" + userOrganizationData?.userImage
                  : User
              }
              alt="userImage"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>
        <span>
          <div className="span-text font-semibold">{user.first_name}</div>

          <div className="span-text">{userOrganizationData?.roleId}</div>
        </span>
      </div>

      <Menu.Item key={"account"}>
        <Link href="/profile">
          <div className="flex items-center">
            <span className="span-text">My Account</span>
          </div>
        </Link>
      </Menu.Item>

      {user?.UserOraganizationGroups?.length > 1 ? (
        <Menu.SubMenu
          key="org"
          title={
            <span className="switch-team-dropdown">
              <UserSwitchOutlined />
              <span className="ml-1">Switch Teams</span>
            </span>
          }
        >
          {user?.UserOraganizationGroups?.length > 0
            ? user?.UserOraganizationGroups.map((item) => {
                return (
                  <Menu.Item key={`team${item.organization_id}`}>
                    <div
                      className="flex items-center"
                      onClick={() => {
                        changeOragnizationHandle(item.organization_id);
                      }}
                    >
                      <span className="span-text capitalize">
                        {item?.organization?.company_name}
                      </span>
                    </div>
                  </Menu.Item>
                );
              })
            : null}
        </Menu.SubMenu>
      ) : null}

      <Menu.Item key={"sign_out"} onClick={() => logoutHandler()}>
        <div className=" flex items-center ">
          <LogoutOutlined /> <span className="span-text">Sign Out</span>
        </div>
      </Menu.Item>
    </Menu>
  );
  const createMenu = (
    <Menu>
      <Menu.Item key={"Review"}>
        <Link href="/review/add">Review</Link>
      </Menu.Item>
      <Menu.Item key={"Template"}>
        <Link href="/template/add">Template</Link>
      </Menu.Item>
      <Menu.Item key={"Applaud"}>
        <Link href="/applaud/add">Applaud</Link>
      </Menu.Item>
      {(userOrganizationData?.role == 2 || userOrganizationData?.role == 3) && (
        <Menu.Item key={"Team"}>
          <Link href="/team/add">Team</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Header className="ant-header bg-color-dashboard border-b border-b-neutral-300 p-0">
      <Row className="items-center h-full" justify="space-between">
        <Col md={12} lg={16} xs={16}>
          <div className="flex  items-center mt-2">
            <div className=" font-bold mx-3 md:mx-6 text-lg md:text-2xl primary-color-blue">
              {title}
            </div>
          </div>
        </Col>
        <Col md={6} lg={3} xs={3} className="create-header-button">
          <div className="flex items-center justify-between md:px-4 ">
            <Dropdown
              overlay={createMenu}
              trigger={["click"]}
              overlayClassName="create-dropdown"
            >
              <div
                key="create"
                type="default"
                className="primary-bg-btn text-white text-base py-2 md:py-2 px-2 rounded flex  items-center justify-center"
              >
                <div className="hidden md:flex items-center ">
                  <div className="mx-2 ">Create</div>
                  <div className="text-xs ">
                    <DownOutlined />
                  </div>
                </div>

                <div className="md:hidden mx-1 text-base ">
                  <PlusOutlined />
                </div>
              </div>
            </Dropdown>
          </div>
        </Col>
        <Col md={6} lg={5} xs={5} className="pr-3 flex items-center">
          <div className="w-full user-menu-wrapper cursor-pointer rounded-md py-1 md:py-1 px-2 ">
            <Dropdown
              trigger={"click"}
              overlay={userMenu}
              overlayClassName="logout-dropdown "
              placement="bottomRight"
            >
              <div>
                <div className="flex items-center">
                  <div className="pr-2">
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      alt="C"
                    >
                      {userOrganizationData?.orgId
                        ? userOrganizationData?.orgId.substring(0, 1)
                        : null}
                    </Avatar>
                  </div>
                  <div className="my-auto">
                    <p className="user-deatils whitespace-nowrap hidden md:block">
                      {userOrganizationData?.orgId}
                    </p>
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
          {!md ? (
            <div onClick={() => setCollapsed(!collapsed)} className="pr-2 pl-1">
              {collapsed ? (
                <MenuUnfoldOutlined className="text-base" />
              ) : (
                <MenuFoldOutlined className="text-base" />
              )}
            </div>
          ) : null}
        </Col>
      </Row>
    </Header>
  );
}

export default HeaderLayout;

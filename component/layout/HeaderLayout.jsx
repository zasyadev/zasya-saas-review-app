import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DownOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import User from "../../assets/images/User.png";
import { Avatar, Col, Dropdown, Layout, Menu, Row, Badge } from "antd";
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
  const [pendingNotification, setPendingNotification] = useState(0);
  const [allNotification, setAllNotification] = useState([]);
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
  const notificationHandle = async () => {
    setAllNotification([]);
    await fetch("/api/notification/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setAllNotification(response.data);
          let filterData = response.data.filter((item) => !item.read_at);
          if (filterData.length) setPendingNotification(filterData.length);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const notificationViewed = async (data) => {
    await fetch("/api/notification", {
      method: "POST",
      body: JSON.stringify({
        id: data,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          console.log(response, "data");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      notificationHandle();
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
                  ? userOrganizationData?.userImage
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
  const notificationMenu = (
    <div className="notification-wrapper">
      {allNotification.length > 0 ? (
        allNotification.map((item, idx) => {
          return (
            <div
              key={idx + "notification"}
              className={`notification-box ${
                allNotification.length - 1 > idx
                  ? "notification-border-bottom"
                  : null
              }`}
              onClick={() => notificationViewed(item.id)}
            >
              <Badge dot={item.read_at ? false : true}>
                <Link href={item.data.link}>
                  <p className="notification-text">{item.data.message}</p>
                </Link>
              </Badge>
            </div>
          );
        })
      ) : (
        <div className="notification-box">
          <p className="notification-text">No Notification</p>
        </div>
      )}
    </div>
  );

  return (
    <Header className="ant-header bg-color-dashboard border-b border-b-neutral-300 p-0">
      <div className="items-center h-full flex justify-between">
        <div className="flex  items-center mt-2">
          <div className=" font-bold mx-3 md:mx-6 text-lg md:text-2xl primary-color-blue">
            {title}
          </div>
        </div>

        <div className="create-header-button flex items-center justify-end md:mr-3">
          <div className="px-2 md:px-4 ">
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
          <div className="w-full user-menu-wrapper cursor-pointer rounded-md py-1 md:py-1 px-2 ">
            <div className="flex items-center">
              <Dropdown
                trigger={"click"}
                overlay={userMenu}
                overlayClassName="logout-dropdown "
                placement="bottomRight"
              >
                <div className="flex items-center">
                  <div className="pr-2">
                    <Avatar
                      style={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                      }}
                      alt="C"
                    >
                      {userOrganizationData?.orgId
                        ? userOrganizationData?.orgId.substring(0, 1)
                        : null}
                    </Avatar>
                  </div>
                  <div className="md:mt-3">
                    <p className="user-deatils whitespace-nowrap hidden md:block">
                      {userOrganizationData?.orgId}
                    </p>
                  </div>
                </div>
              </Dropdown>
              <Dropdown
                trigger={"click"}
                overlay={notificationMenu}
                overlayClassName="notification-dropdown "
                placement="bottomRight"
              >
                <div className="notification-icon">
                  <Badge count={pendingNotification}>
                    <BellOutlined style={{ fontSize: 22 }} />
                  </Badge>
                </div>
              </Dropdown>
            </div>
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
        </div>
      </div>
    </Header>
  );
}

export default HeaderLayout;

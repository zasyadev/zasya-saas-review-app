import React, { useEffect, useState, useMemo } from "react";
import {
  PlusOutlined,
  DownOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
} from "@ant-design/icons";

import Link from "next/link";

import { Avatar, Dropdown, Layout, Menu, Badge } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import DefaultImages from "../common/DefaultImages";

const { Header } = Layout;

function HeaderLayout({ title, user, collapsed, setCollapsed, md }) {
  const router = useRouter();

  const [allNotification, setAllNotification] = useState([]);

  const logoutHandler = () => {
    signOut();
  };

  const changeOragnizationHandle = async (values) => {
    await httpService
      .post(`/api/user/changeOrgId/${user.id}`, { org_id: values })
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.reload();
        }
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  };

  const getAllNotification = async () => {
    await httpService
      .get(`/api/notification/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setAllNotification(response.data);
        }
      })
      .catch((err) => {
        setAllNotification([]);
        console.error(err.response.data.message);
      });
  };

  const notificationViewed = async (data) => {
    await httpService
      .post(`/api/notification`, {
        id: data,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          getAllNotification();
        }
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  };

  const unSeenNotificationCount = useMemo(
    () =>
      allNotification && allNotification?.length > 0
        ? allNotification.filter((item) => !item.read_at).length
        : 0,
    [allNotification]
  );

  useEffect(() => {
    getAllNotification();
  }, []);

  const userMenu = (
    <Menu>
      <div className="flex my-2 mx-2" key={"accountName"}>
        <div className="flex mx-2 px-2">
          <div className="rounded-full">
            <DefaultImages
              imageSrc={user?.UserDetails?.image}
              width={40}
              height={40}
            />
          </div>
        </div>
        <span>
          <div className="span-text font-semibold">{user.first_name}</div>

          <div className="span-text">{user?.role?.name}</div>
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
      {user.role_id !== 4 && (
        <Menu.Item key={"Team"}>
          <Link href="/team/add">Team</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  const notificationMenu = (
    <div className="notification-wrapper bg-white shadow-xl rounded-md">
      <div className="flex items-center justify-between border-b border-gray-300 p-2">
        <p className="text-sm font-bold">Notifications</p>
        {unSeenNotificationCount > 0 && (
          <button
            className="font-semibold text-xs text-primary rounded-full"
            onClick={() => notificationViewed("ALL")}
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="notification-inner no-scrollbar divide-y py-1">
        {allNotification.length > 0 ? (
          allNotification.map((item, idx) => (
            <div
              key={idx + "notification"}
              className={`notification-box ${
                allNotification.length - 1 > idx
                  ? "notification-border-bottom"
                  : null
              }`}
              onClick={() => notificationViewed(item.id)}
            >
              <Link href={item.data.link}>
                <p
                  className={`${
                    item.read_at ? "text-gray-400" : "font-medium"
                  } hover:bg-gray-50 text-sm p-2 mb-0 cursor-pointer`}
                >
                  {item.data.message}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <div className="p-2 mb-0">
            <p className="text-gray-400 text-center mb-0">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Header className="ant-header bg-color-dashboard border-b border-b-neutral-300 p-0">
      <div className="flex items-center h-full justify-between mx-4 md:mx-6">
        <div className="font-bold text-lg md:text-2xl primary-color-blue">
          {title}
        </div>

        <div className="create-header-button flex items-center justify-end space-x-3 md:space-x-5">
          <Dropdown
            overlay={createMenu}
            trigger={["click"]}
            overlayClassName="create-dropdown"
          >
            <div
              key="create"
              type="default"
              className="primary-bg-btn text-white text-base h-9 px-3 rounded flex  items-center justify-center cursor-pointer"
            >
              <div className="hidden md:flex items-center space-x-3">
                <span>Create</span>
                <DownOutlined className="text-xs" />
              </div>

              <div className="md:hidden mx-1 text-base ">
                <PlusOutlined />
              </div>
            </div>
          </Dropdown>{" "}
          <Dropdown
            trigger={"click"}
            overlay={notificationMenu}
            overlayClassName="notification-dropdown"
            placement="bottomRight"
            className="w-10 h-10 py-2 px-3 bg-light grid place-content-center rounded-full cursor-pointer"
          >
            <Badge count={unSeenNotificationCount} offset={[-5, 5]}>
              <BellOutlined className="text-base" />
            </Badge>
          </Dropdown>
          <div className="w-full user-menu-wrapper cursor-pointer rounded-md ">
            <Dropdown
              trigger={"click"}
              overlay={userMenu}
              overlayClassName="logout-dropdown "
              placement="bottomRight"
              className="py-2 px-3"
            >
              <div className="flex items-center">
                <Avatar
                  style={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  }}
                  alt="C"
                  className="mr-3"
                  size="small"
                >
                  {user?.organization && user?.organization?.company_name
                    ? user.organization.company_name.substring(0, 1)
                    : null}
                </Avatar>

                <p className="user-deatils whitespace-nowrap hidden md:block">
                  {user?.organization?.company_name}
                </p>
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
        </div>
      </div>
    </Header>
  );
}

export default HeaderLayout;

import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserSwitchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Dropdown, Layout, Menu } from "antd";
import { signOut } from "next-auth/react";
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

  const changeOragnizationHandle = async ({ orgId, roleId }) => {
    await httpService
      .post(`/api/user/changeOrgId/${user.id}`, {
        org_id: orgId,
        roleId: roleId,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.reload();
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
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
        console.error(err.response.data?.message);
      });
  };

  const notificationViewed = async (data) => {
    await httpService
      .post(`/api/notification`, {
        id: data,
        user_id: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          getAllNotification();
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
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
    <Menu className="divide-y border border-gray-100">
      <div className=" py-2 px-3 " key={"accountName"}>
        <p className=" font-semibold mb-0 text-gray-700 text-base capitalize">
          {user.organization?.company_name}
        </p>
        <p className="mb-0 text-sm text-gray-600 font-medium">
          {user.role?.name}
        </p>
      </div>

      <Menu.Item key={"account"}>
        <Link href="/profile" passHref>
          <div className="flex items-center py-1  text-base font-medium space-x-2">
            <UserOutlined />
            <span className="ml-1">My Account</span>
          </div>
        </Link>
      </Menu.Item>

      {user?.UserOraganizationGroups?.length > 1 ? (
        <Menu.SubMenu
          key="org"
          title={
            <div className="flex items-center py-1  text-base font-medium space-x-2">
              <UserSwitchOutlined />
              <span className="ml-1">Switch Organization</span>
            </div>
          }
        >
          {user?.UserOraganizationGroups?.length > 0
            ? user?.UserOraganizationGroups.map((item) => {
                return (
                  <Menu.Item
                    key={`team${item.organization_id}`}
                    className={
                      user.organization_id === item.organization_id
                        ? "bg-gray-200"
                        : ""
                    }
                  >
                    <div
                      className="flex font-medium items-center"
                      onClick={() => {
                        changeOragnizationHandle({
                          orgId: item.organization_id,
                          roleId: item.role_id,
                        });
                      }}
                    >
                      <span className="text-base capitalize">
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
        <div className="flex items-center py-1  font-medium space-x-2 text-base">
          <LogoutOutlined /> <span>Sign Out</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <div className="notification-wrapper border border-gray-100 bg-white shadow-xl rounded-md">
      <div className="flex items-center justify-between border-b border-gray-300 p-2">
        <p className="text-sm lg:text-base font-bold mb-0">Notifications</p>
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
                  : ""
              }`}
              onClick={() => notificationViewed(item.id)}
            >
              <Link href={item.data.link} passHref>
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

  console.log(user?.UserDetails?.image, "user?.UserDetails?.image");

  return (
    <Header className="ant-header bg-white border-b border-b-neutral-300 p-0">
      <div className="flex items-center h-full justify-between mx-4 md:mx-6">
        <div className="font-bold text-lg md:text-2xl text-primary">
          {title}
        </div>

        <div className="create-header-button flex items-center justify-end space-x-3 md:space-x-5">
          <Dropdown
            trigger={"click"}
            overlay={notificationMenu}
            overlayClassName="notification-dropdown"
            placement="bottomRight"
            className=" bg-white  grid place-content-center  cursor-pointer transition-all  duration-300 hover:bg-gray-100 rounded-full w-11 h-11"
          >
            <Badge count={unSeenNotificationCount} offset={[-5, 8]}>
              <BellOutlined className="text-xl text-gray-600 hover:text-primary " />
            </Badge>
          </Dropdown>
          <div className="flex-1 bg-white   cursor-pointer   transition-all  duration-300 hover:bg-gray-100 rounded-full">
            <Dropdown
              trigger={"click"}
              overlay={userMenu}
              overlayClassName="logout-dropdown "
              placement="bottomRight"
              className="py-1 px-2 leading-0"
            >
              <div className="flex items-center space-x-3">
                <div className="user-deatils hidden md:block m-0 text-base font-semibold text-primary">
                  {user.first_name}
                </div>
                <DefaultImages
                  imageSrc={user?.UserDetails?.image}
                  width={38}
                  height={38}
                />
              </div>
            </Dropdown>
          </div>
          {!md ? (
            <div
              onClick={() => setCollapsed(!collapsed)}
              className="w-10 h-10 py-2 px-3 bg-white grid place-content-center rounded-md cursor-pointer"
            >
              {collapsed ? (
                <MenuUnfoldOutlined className="text-lg" />
              ) : (
                <MenuFoldOutlined className="text-lg" />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Header>
  );
}

export default HeaderLayout;

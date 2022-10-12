import {
  ArrowLeftOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Layout } from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import DefaultImages from "../common/DefaultImages";
import NotificationMenus from "./components/NotificationMenus";
import UserMenus from "./components/UserMenus";

const { Header } = Layout;

function HeaderLayout({ isBack, title, user, collapsed, setCollapsed, md }) {
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

  return (
    <Header className="ant-header bg-white border-b border-b-neutral-300 p-0">
      <div className="flex items-center h-full justify-between mx-4 md:mx-6">
        <div className="flex items-center">
          {isBack && (
            <div
              className=" bg-white  grid place-content-center  cursor-pointer transition-all  duration-300 hover:bg-gray-100 rounded-full w-11 h-11 mr-3"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeftOutlined className="text-xl text-gray-600 hover:text-primary " />
            </div>
          )}

          <p className="font-bold text-lg md:text-2xl text-primary  max-w-xs lg:max-w-sm single-line-clamp mb-0">
            {title}
          </p>
        </div>

        <div className="create-header-button flex items-center justify-end space-x-3 md:space-x-5">
          <Dropdown
            trigger={"click"}
            overlay={
              <NotificationMenus
                allNotification={allNotification}
                unSeenNotificationCount={unSeenNotificationCount}
                notificationViewed={notificationViewed}
              />
            }
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
              overlay={
                <UserMenus
                  user={user}
                  changeOragnizationHandle={changeOragnizationHandle}
                  logoutHandler={logoutHandler}
                />
              }
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

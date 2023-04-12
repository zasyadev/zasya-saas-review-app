import { BellOutlined } from "@ant-design/icons";
import { Badge, Dropdown } from "antd";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { URLS } from "../../../constants/urls";
import httpService from "../../../lib/httpService";
import DefaultImages from "../../common/DefaultImages";
import NotificationMenus from "./NotificationMenus";

function UserProfileHeader({ user }) {
  const [allNotification, setAllNotification] = useState([]);
  const getAllNotification = async () => {
    await httpService
      .get(`/api/notification/${user.id}`)
      .then(({ data: response }) => setAllNotification(response.data))
      .catch(() => setAllNotification([]));
  };

  const handleDeleteAllNotifications = async () => {
    await httpService
      .delete(`/api/notification/${user.id}`)
      .then(() => getAllNotification())
      .catch(() => {});
  };

  const notificationViewed = async (data) => {
    await httpService
      .post(`/api/notification`, {
        id: data,
      })
      .then(() => getAllNotification())
      .catch(() => {});
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
    <div className="flex md:flex-shrink-0 items-center justify-end md:justify-between space-x-2 mr-4 md:mr-0">
      <Link href={URLS.PROFILE} passHref>
        <div className="md:flex-1 md:flex-shrink-0 bg-transparent cursor-pointer transition-all duration-300 rounded-full">
          <div className="flex items-center md:space-x-3">
            <DefaultImages
              imageSrc={user?.UserDetails?.image}
              width={38}
              height={38}
            />
            <div className="user-deatils hidden md:block m-0 text-base font-semibold">
              {user.first_name}
            </div>
          </div>
        </div>
      </Link>

      <Dropdown
        trigger={unSeenNotificationCount > 0 ? "click" : ""}
        overlay={
          <NotificationMenus
            allNotification={allNotification}
            unSeenNotificationCount={unSeenNotificationCount}
            notificationViewed={notificationViewed}
            deleteNotifications={handleDeleteAllNotifications}
          />
        }
        overlayClassName="notification-dropdown"
        placement="bottomRight"
        className=" bg-transparent grid place-content-center cursor-pointer transition-all border duration-300 rounded-full w-11 h-11"
      >
        <Badge count={unSeenNotificationCount} offset={[-5, 8]}>
          <BellOutlined className="text-xl text-gray-600 hover:text-primary-green leading-0" />
        </Badge>
      </Dropdown>
    </div>
  );
}

export default UserProfileHeader;

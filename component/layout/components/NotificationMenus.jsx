import React from "react";
import Link from "next/link";
import moment from "moment";

const NotificationMenus = ({
  allNotification,
  unSeenNotificationCount,
  notificationViewed,
  // deleteNotifications,
}) => {
  return unSeenNotificationCount > 0 ? (
    <div className="notification-wrapper border border-gray-100 bg-white shadow-xl rounded-md">
      <div className="flex items-center justify-between border-b border-gray-300 p-2 md:p-3 gap-6">
        {unSeenNotificationCount > 0 && (
          <>
            <p className="text-sm lg:text-base font-bold mb-0">Notifications</p>

            <button
              className="font-semibold text-xs text-primary rounded-full"
              onClick={() => notificationViewed("ALL")}
            >
              Mark all as read
            </button>
          </>
        )}

        {/* {(
          allNotification.length > 0 && (
            <button
              className="font-semibold text-xs text-gray-600 rounded-full"
              onClick={() => deleteNotifications()}
            >
              Clear all
            </button>
          )
        )} */}
      </div>
      <div className="notification-inner no-scrollbar divide-y py-1">
        {allNotification.length > 0 ? (
          allNotification
            .filter((item) => !item.read_at)
            .map((item, idx) => (
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
                  <div className="p-2 md:p-3 hover:bg-gray-50 cursor-pointer">
                    <p
                      className={`${
                        item.read_at ? "text-gray-500" : ""
                      }  text-sm  font-medium  mb-0 `}
                    >
                      {item.data.message}
                    </p>
                    {item?.created_date && (
                      <p className="mb-0  text-gray-400  text-xs leading-4">
                        {moment(item.created_date).fromNow()}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))
        ) : (
          <div className="p-2 mb-0">
            <p className="text-gray-500 font-medium text-center mb-0">
              No notifications
            </p>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default NotificationMenus;

import {
  LogoutOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import React from "react";

const UserMenus = ({ user, changeOragnizationHandle, logoutHandler }) => {
  return (
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
};

export default UserMenus;

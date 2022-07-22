import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import User from "../../assets/images/User.png";
import { Avatar, Col, Dropdown, Layout, Menu, Row } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../helpers/notification";
// import { BellIcon, SearchIcon } from "../../assets/Icon/icons";

const { Header } = Layout;

function HeaderLayout({ title, pageName, user }) {
  const [userOrganizationData, setUserOrganizationData] = useState({
    orgId: "",
    roleId: "",
  });
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
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function fetchUserData() {
    await fetch("/api/organization/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setUserOrganizationData({
            orgId: response?.data?.organization?.company_name,
            roleId:
              response?.data?.roleData?.role_id === 2
                ? "Admin"
                : response?.data?.roleData?.role_id === 3
                ? "Manager"
                : response?.data?.roleData?.role_id === 4
                ? "Member"
                : null,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, []);

  const userMenu = (
    <Menu>
      <div className="flex my-2 " key={"accountName"}>
        <div className="flex ml-6 mr-2">
          <Image src={User} alt="user" width={40} height={30} />
        </div>
        <span>
          <div className="span-text font-semibold">{user.first_name}</div>
          {/* <div>{user.role_id === 2 ? "Admin" : "Member"}</div> */}
          <div className="span-text">{userOrganizationData?.roleId}</div>
        </span>
      </div>

      <Menu.Item key={"account"}>
        <Link href="/profile">
          <div className="flex items-center">
            <UserOutlined /> <span className="span-text">My Account</span>
          </div>
        </Link>
      </Menu.Item>
      {user.role_id == 2 && (
        <Menu.Item key={"team"}>
          <Link href="/team/members">
            <div className="flex items-center">
              {" "}
              <UsergroupAddOutlined /> <span className="span-text">Team</span>
            </div>
          </Link>
        </Menu.Item>
      )}
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

      <Menu.Item key={"sign_out"}>
        <div onClick={() => logoutHandler()} className=" flex items-center ">
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
      {user.role_id == 2 && (
        <Menu.Item key={"Team"}>
          <Link href="/team/add">Team</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Header className="ant-header bg-color-dashboard border-b border-b-neutral-300 p-0">
      <Row className="items-center h-full">
        <Col md={16} xs={12}>
          <div className="flex justify-between items-center mt-2">
            <div className=" font-bold mx-3 md:mx-6 text-lg md:text-2xl primary-color-blue">
              {title}
            </div>
          </div>
        </Col>
        <Col md={3} xs={12} className="hidden md:block">
          <div className="hidden md:flex items-center justify-between px-3 ">
            <Dropdown
              overlay={createMenu}
              trigger={["click"]}
              overlayClassName="create-dropdown"
            >
              <button
                key="create"
                type="default"
                className="primary-bg-btn text-white text-base py-3  px-5 rounded flex  items-center  "
              >
                <span className="mr-2">Create</span> <DownOutlined />
              </button>
            </Dropdown>
          </div>
        </Col>
        <Col md={5} xs={12} className="pr-3">
          <Dropdown
            trigger={"click"}
            overlay={userMenu}
            overlayClassName="logout-dropdown "
            placement="bottomRight"
          >
            <div className="flex items-center user-menu-wrapper py-1 px-4 cursor-pointer rounded-md">
              <div className="rounded-md flex justify-between mr-3 ">
                <Avatar
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  size="large"
                  alt="c"
                >
                  {userOrganizationData?.orgId
                    ? userOrganizationData?.orgId.substring(0, 1)
                    : null}
                </Avatar>
              </div>
              <div>
                <div className="user-deatils">
                  {userOrganizationData?.orgId}
                </div>
                {/* <div>{user.role_id === 2 ? "Admin" : "Member"}</div> */}
              </div>
            </div>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
}

export default HeaderLayout;

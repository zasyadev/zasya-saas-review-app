import React from "react";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

import { Avatar, Button, Col, Dropdown, Input, Layout, Menu, Row } from "antd";
import { signOut } from "next-auth/client";
import { useRouter } from "next/router";
import { BellIcon, SearchIcon } from "../../assets/Icon/icons";

const { Header } = Layout;

function HeaderLayout({ title, pageName }) {
  const router = useRouter();
  const logoutHandler = () => {
    signOut({
      redirect: false,
    });
    router.replace("/");
  };
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <p onClick={() => logoutHandler()}>Logout</p>,
        },
      ]}
    />
  );
  return (
    <Header className="ant-header bg-color-dashboard border-b border-b-neutral-300 p-0">
      <Row>
        <Col md={20} xs={12}>
          <div className="flex justify-between items-center mt-2">
            <div className=" font-bold mx-3 md:mx-6 text-2xl primary-color-blue">
              {title}
            </div>
            <div className="hidden rounded-lg searchbar-bg  shadow-md md:flex items-center justify-between px-3">
              <Input placeholder="Search" bordered={false} />
              <button>
                <SearchIcon />
              </button>
            </div>
          </div>
        </Col>
        <Col md={4} xs={12}>
          <div className=" flex justify-end mt-2 pr-3">
            <div className="rounded-md flex justify-between mx-3 ">
              {/* <div className="bg-gray-100 rounded-full py-2 px-2 mr-4"> */}
              {/* <BellIcon /> */}
              {/* </div> */}
              <div>
                <Dropdown
                  trigger={"click"}
                  overlay={menu}
                  overlayClassName="logout-dropdown "
                  placement="bottomRight"
                  size=""
                >
                  <div className="flex items-center justify-center cursor-pointer">
                    <Avatar
                      className="bg-gray-400"
                      size={38}
                      icon={<UserOutlined />}
                    />
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* <div className="px-4 flex item justify-start ">
        <div>{title} </div>
        <div className="">
          <span
            onClick={() => setCollapsed(!collapsed)}
            className=" cursor-pointer text-white text-lg"
          >
            {collapsed ? (
              <MenuUnfoldOutlined className="sidebar-icon" />
            ) : (
              <MenuFoldOutlined className="sidebar-icon" />
            )}
          
          </span>
        </div> 

        <div className="flex items-end justify-end">
          <div className="flex items-center justify-between mt-3">
            <Image src={User} alt="user" width={38} height={38} />

            <Button
              className="text-black bg-white text-center justify-center ml-4 rounded-md "
              onClick={() => logoutHandler()}
            >
              Logout
               <span
              onClick={() => logoutHandler()}
              className=" cursor-pointer text-white text-sm tracking-wider   "
            >
              <LogoutOutlined />
            </span> 
            </Button>
          </div>
        </div>
      </div> */}
    </Header>
  );
}

export default HeaderLayout;

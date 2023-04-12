import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { URLS } from "../../constants/urls";
import httpService from "../../lib/httpService";
import { openNotificationBox } from "../common/notification";
import OrganizationSelectBox from "./components/OrganizationSelectBox";

const { Sider } = Layout;

function SiderLayout({ collapsed, setCollapsed, items, lg, user }) {
  const router = useRouter();
  const onClickSideTab = (e) => {
    if (e.key.includes("/")) {
      router.push(e.key);
    }
  };

  const changeOragnizationHandle = async (value) => {
    const org = user?.UserOraganizationGroups?.find(
      (item) => item.organization_id === value
    );
    if (org?.organization_id === user?.organization_id) {
      return null;
    }
    await httpService
      .post(`/api/user/changeOrgId`, {
        org_id: org.organization_id,
        roleId: org.role_id,
      })
      .then(({ data: response }) => {
        openNotificationBox("success", response.message, 3);
        router.reload();
      })
      .catch((err) =>
        openNotificationBox("error", err.response.data?.message, 3)
      );
  };
  const logoutHandler = () => {
    signOut();
  };

  const createItems = [
    {
      key: "call-review",
      link: URLS.REVIEW_CREATE,
      name: "Review",
    },
    {
      key: "call-goals",
      link: URLS.GOAL_CREATE,
      name: "Goals",
    },
    {
      key: "call-applauds",
      link: URLS.APPLAUD_CREATE,
      name: "Applauds",
    },
    {
      key: "call-follow",
      link: URLS.FOLLOW_UP_CREATE,
      name: "Follow Up",
    },
    {
      key: "call-template",
      link: URLS.TEMPLATE_CREATE,
      name: "Template",
    },
  ];

  return (
    <Sider
      // collapsible
      collapsedWidth={lg ? "80" : "0"}
      collapsed={collapsed}
      className="sider bg-brandGray-100 fixed top-0 left-0 bottom-0 overflow-auto min-h-screen z-50 no-scrollbar"
      onCollapse={(value) => setCollapsed(value)}
      width={240}
    >
      <div className="flex flex-col justify-between min-h-screen px-2 border-r border-gray-300">
        <div className="items-stretch min-h-full flex-nowrap px-0 relative space-y-2">
          <Link href="/dashboard" passHref>
            <div className="h-24 2xl:h-28 grid place-content-center text-center w-full cursor-pointer px-3">
              <Image
                src={"/media/images/logos/review_app.png"}
                width={100}
                height={51}
                alt="review_logo"
              />
            </div>
          </Link>

          <div className="w-full grid place-content-center ">
            <Dropdown
              trigger={"click"}
              overlay={
                <Menu className="divide-y p-0">
                  {createItems.map((item) => (
                    <Menu.Item className="font-semibold" key={item.key}>
                      <Link href={item.link}>{item.name}</Link>
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <p className="w-52 bg-brandGray-50 py-3 px-4 rounded-md mb-0 flex justify-between items-center text-17 font-medium cursor-pointer">
                Create
                <span>
                  <PlusOutlined className="bg-primary-green text-white rounded-full text-lg w-8 h-8 grid place-content-center" />
                </span>
              </p>
            </Dropdown>
          </div>

          <div className="overflow-y-auto overflow-x-hidden max-h-96 custom-scrollbar">
            <Menu
              onClick={onClickSideTab}
              mode="inline"
              defaultSelectedKeys={router?.pathname}
              className="dashboard-sider border-0 bg-brandGray-100 text-17 font-medium"
              items={items}
            />
          </div>
        </div>

        <div className="w-full py-3 px-4 space-y-3">
          <p className="mb-0 flex justify-between items-center text-17 font-semibold">
            Workspace
          </p>
          <OrganizationSelectBox
            user={user}
            changeOragnizationHandle={changeOragnizationHandle}
          />
          <p
            className="mb-0 flex items-center text-17 font-medium cursor-pointer"
            onClick={() => logoutHandler()}
          >
            <span className="mr-4">
              <LogoutOutlined className="bg-brandGray-100 rounded-md text-lg w-8 h-8" />
            </span>
            Logout
          </p>
        </div>
      </div>
    </Sider>
  );
}

export default SiderLayout;

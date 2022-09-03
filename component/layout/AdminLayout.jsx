import {
  AppstoreOutlined,
  DashboardOutlined,
  FormOutlined,
  LikeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Grid, Layout } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { Fragment, useEffect, useState, useMemo } from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import httpService from "../../lib/httpService";
import HeaderLayout from "./HeaderLayout";
import SiderLayout from "./SiderLayout";

const { useBreakpoint } = Grid;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function AdminLayout(props) {
  const { md } = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [userOrganizationData, setUserOrganizationData] = useState({
    orgId: "",
    roleId: "",
    role: 0,
    userImage: "",
  });

  useEffect(() => {
    if (md) setCollapsed(false);
    else setCollapsed(true);
  }, [md]);

  async function fetchUserData() {
    await httpService
      .get(`/api/organization/${props.user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserOrganizationData({
            orgId: response.data?.organization?.company_name,
            roleId:
              response.data?.roleData?.role_id === 2
                ? "Admin"
                : response.data?.roleData?.role_id === 3
                ? "Manager"
                : response.data?.roleData?.role_id === 4
                ? "Member"
                : null,
            role: response.data?.roleData?.role_id,
            userImage: response.data?.UserDetails?.image,
          });
        }
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  }

  useEffect(() => {
    if (props.user && props.user.id) {
      fetchUserData();
    }
  }, [props.user]);

  const allMenus = [
    getItem(
      "DashBoard",
      "/dashboard",
      <DashboardOutlined className="sidebar-icon" />
    ),

    getItem("Reviews", "/review", <FormOutlined className="sidebar-icon " />),

    getItem(
      "Team",
      "/team/members",
      <AppstoreOutlined className="sidebar-icon " />
    ),
    getItem("Applaud", "/applaud", <LikeOutlined className="sidebar-icon " />),

    getItem(
      "Settings",
      "setting",
      <SettingOutlined className="sidebar-icon " />,
      [getItem("Templates", "/template"), getItem("Profile ", "/profile ")]
    ),
  ];

  const filteredMenus = useMemo(() => {
    if (userOrganizationData?.role == 2 || userOrganizationData?.role == 3) {
      return allMenus;
    } else {
      return allMenus.filter((item) => item.label !== "Team");
    }
  }, [userOrganizationData]);

  return (
    <Fragment>
      <HeadersComponent />
      <Layout>
        <SiderLayout
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          items={filteredMenus}
          md={md}
        />
        <Layout>
          <Content className="bg-color-dashboard ">
            <HeaderLayout
              title={props.title}
              user={props.user}
              fetchUserData={fetchUserData}
              userOrganizationData={userOrganizationData}
              setCollapsed={setCollapsed}
              collapsed={collapsed}
              md={md}
            />
            {props.children}
          </Content>
          <Footer className="text-center bg-color-dashboard">
            Review App ©2022 Created by Zasya Solution
          </Footer>
        </Layout>
      </Layout>
    </Fragment>
  );
}

export default AdminLayout;

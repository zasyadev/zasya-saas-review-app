import { EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import { MONTH_DATE_FORMAT } from "../../helpers/dateHelper";
import getApplaudCategoryName from "../../helpers/getApplaudCategoryName";
import httpService from "../../lib/httpService";
import CustomModal from "../common/CustomModal";
import CustomPopover from "../common/CustomPopover";
import DefaultImages from "../common/DefaultImages";

const BASE = process.env.NEXT_PUBLIC_APP_URL;

function Profile({ user }) {
  const [orgForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [organizationModal, setOrganizationModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [applaudLimit, setApplaudLimit] = useState(0);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);
  const [givenApplaudList, setGivenApplaudList] = useState([]);

  const getProfileData = async () => {
    setUserDetails({});
    setLoading(true);
    await httpService
      .get(`/api/profile/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserDetails(response.data);
          setLoading(false);
        }
      })
      .catch((err) => console.error(err?.response?.data?.message));
  };

  async function fetchApplaudData() {
    setGivenApplaudList([]);
    await httpService
      .get(`/api/applaud/${user.id}`)
      .then(({ data: res }) => {
        setGivenApplaudList(res.data.givenApplaud);
        setReceivedApplaudList(res.data.receivedApplaud);
      })
      .catch((err) => {
        setGivenApplaudList([]);
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    getProfileData();
    fetchApplaudData();
    if (user.role_id === 2) fetchOrgData();
  }, []);

  const shareLinkedinUrl = (data) => {
    let urlEncoded = encodeURI(`https://www.linkedin.com/shareArticle?\
mini=true&\
url=${BASE}&\
title=${data?.created?.first_name + " has given you a Applaud."}&\
summary=${data?.comment}&\
source=LinkedIn`);

    window.open(
      urlEncoded,
      "_blank",
      "width=550,height=431,location=no,menubar=no,scrollbars=no,status=no,toolbar=no"
    );
  };

  const onChangeOrgData = async (values) => {
    await httpService
      .put(`/api/profile/organization`, {
        applaud_count: Number(values.applaud_count),
        userId: user.id,
        orgId: user.organization_id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setOrganizationModal(false);
          openNotificationBox("success", response.message, 3);
          fetchOrgData();
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message, 3);
      });
  };
  const fetchOrgData = async () => {
    await httpService
      .post(`/api/profile/organization`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setApplaudLimit(response.data.organization.applaud_count);
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message, 3);
      });
  };

  const handleEditApplaudLimit = (applaud_count) => {
    setOrganizationModal(true);
    orgForm.setFieldsValue({
      applaud_count: applaud_count ?? 0,
    });
  };

  return loading ? (
    <div className="grid grid-cols-1 xl:grid-cols-6 mt-1">
      <div className="xl:col-start-1 xl:col-end-7 px-4 ">
        <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2">
          <Row gutter={16}>
            <Col lg={24} xs={24} className="mt-4 items-center">
              <Skeleton active />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Row gutter={[32, 32]}>
        <Col md={24} xs={24}>
          <div className="bg-white relative rounded-md overflow-hidden transition-all duration-300 ease-in-out shadow-md">
            <div className="relative h-28 lg:h-48">
              <Image
                src={"/media/images/profile-cover.webp"}
                alt="profileCover"
                layout="fill"
              />
            </div>
            <div className="px-2 py-2 text-center absolute bottom-32 right-0 left-0 lg:bottom-2 lg:top-auto lg:right-auto lg:left-12 ">
              <div className="relative rounded-full w-24 h-24 overflow-hidden  mx-auto">
                <DefaultImages imageSrc={userDetails?.image} layout="fill" />
              </div>
            </div>

            <div className="md:flex justify-between items-center pt-14 px-4 md:px-6 lg:pt-2 pb-3 gap-4">
              <div className="lg:ml-36 mb-2 lg:mb-0">
                <p className="text-base font-semibold text-center  text-primary md:text-left mb-0">
                  {userDetails?.user?.first_name}
                </p>
                <p className="text-sm font-medium text-center  text-gray-600 md:text-left mb-0">
                  {userDetails?.user?.role?.name},
                  {userDetails?.user?.organization?.company_name}
                </p>
              </div>
              <div className="flex flex-wrap justify-around lg:justify-between items-center pb-2 md:pb-0 gap-3">
                <div className="text-center ">
                  <p className="text-xl font-semibold mb-0">
                    {givenApplaudList?.length}
                  </p>
                  <p className="text-sm  font-medium mb-0">Appalud Given</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold mb-0">
                    {receivedApplaudList?.length}
                  </p>
                  <p className="text-sm  font-medium mb-0">Appalud Received</p>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={10} xs={24}>
          <div className="bg-white rounded-md transition-all duration-300 ease-in-out shadow-md p-5 xl:py-5  xl:px-8 space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <p className="mb-0 text-lg md:text-xl text-primary font-semibold">
                General Information
              </p>
              <Link href="/profile/edit " passHref>
                <div className="hover:bg-gray-100 border border-gray-300  py-1 px-2 rounded-full cursor-pointer transition-all  duration-300 ease-in-out">
                  <EditOutlined className="text-base text-primary" />
                </div>
              </Link>
            </div>

            <div>
              <p className="text-sm 2xl:text-base text-primary font-semibold mb-1">
                Address
              </p>
              <p className="text-base font-medium text-gray-600 mb-1">
                {userDetails?.address1} {userDetails?.address2}
              </p>
            </div>
            <div>
              <p className="text-sm 2xl:text-base text-primary font-semibold mb-1">
                Phone No.
              </p>
              <p className="text-text-sm 2xl:text-base font-medium text-gray-600 mb-1">
                {userDetails?.mobile}
              </p>
            </div>

            <div>
              <p className="text-sm 2xl:text-base text-primary font-semibold mb-1">
                About
              </p>
              <p className="text-sm 2xl:text-base font-medium text-gray-600 mb-1">
                {userDetails?.about}
              </p>
            </div>
          </div>

          {user.role_id === 2 && user.organization_id ? (
            <div className="bg-white rounded-md transition-all duration-300 ease-in-out shadow-md p-5 py-4 xl:py-5  xl:px-8 space-y-4 mt-8">
              <p className=" text-lg md:text-xl text-primary font-semibold mb-0">
                Applaud Information
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm 2xl:text-base text-primary font-semibold mb-1 flex items-center">
                    Applaud Limit
                    <span className="leading-[0] ml-2">
                      {CustomPopover(
                        "Count of Applauds that can be given by members in a month."
                      )}
                    </span>
                  </p>

                  <p className="text-sm 2xl:text-base font-medium mb-1 flex items-center justify-between text-gray-600">
                    {applaudLimit}
                  </p>
                </div>
                <p
                  onClick={() => handleEditApplaudLimit(applaudLimit)}
                  className="hover:bg-gray-100 border border-gray-300  py-1 px-2 rounded-full cursor-pointer transition-all  duration-300 ease-in-out"
                >
                  <EditOutlined className="text-base text-primary " />
                </p>
              </div>
            </div>
          ) : null}
        </Col>

        <Col md={14} xs={24}>
          <div className=" profile-applaud-card no-scrollbar">
            <div className="bg-white rounded-md transition-all duration-300 ease-in-out shadow-md mb-4  p-5  xl:py-5  xl:px-8 space-y-4 md:space-y-6">
              <p className=" text-lg md:text-xl text-primary font-semibold mb-0">
                Applaud Recieved
              </p>
              {receivedApplaudList.length > 0 ? (
                receivedApplaudList.map((item, idx) => {
                  return (
                    <div key={idx + "applaud"}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <DefaultImages
                            imageSrc={item?.created?.UserDetails?.image}
                            width={40}
                            height={40}
                          />

                          <div>
                            <p className="text-base font-semibold mb-0">
                              {item.created.first_name}
                            </p>
                            <p className="font-medium text-xs mb-0">
                              {moment(item.created_date).format(
                                MONTH_DATE_FORMAT
                              )}
                            </p>
                          </div>
                        </div>

                        <div
                          className="flex justify-end cursor-pointer"
                          onClick={() => shareLinkedinUrl(item)}
                        >
                          <div className="hover:bg-gray-100 border border-gray-300  py-1 px-2 rounded-full cursor-pointer transition-all  duration-300 ease-in-out">
                            <ShareAltOutlined className="text-base text-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-base font-normal mb-2">
                          {item?.comment}
                        </p>
                        <p className="mb-0 flex flex-wrap gap-2">
                          {item?.category?.length > 0 &&
                            item?.category.map((category, idx) => {
                              return (
                                <span
                                  key={idx + "cat"}
                                  className=" px-2 py-1 rounded-full bg-gray-100 text-xs "
                                >
                                  {getApplaudCategoryName(category)}
                                </span>
                              );
                            })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-base font-normal mb-2">
                  No Applauds Recieved Yet
                </p>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <CustomModal
        title="Update Applaud Limit"
        visible={organizationModal}
        onCancel={() => setOrganizationModal(false)}
        footer={[
          <SecondaryButton
            onClick={() => setOrganizationModal(false)}
            className=" h-full mr-2"
            title="Cancel"
            key="cancel_btn"
          />,
          <PrimaryButton
            onClick={() => orgForm.submit()}
            className=" h-full  "
            title="Update"
            key="update_btn"
          />,
        ]}
        customFooter
        modalProps={{ wrapClassName: "view_form_modal" }}
      >
        <Form
          form={orgForm}
          layout="vertical"
          autoComplete="off"
          onFinish={onChangeOrgData}
        >
          <div className=" mx-2">
            <Form.Item
              label="Applaud Limit "
              name="applaud_count"
              rules={[
                {
                  validator: (_, value) => {
                    if (Number(value) > 0 && Number(value) < 1000) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Please Enter valid Limit");
                    }
                  },
                },
              ]}
            >
              <Input
                placeholder=" Applaud Limit"
                className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              />
            </Form.Item>
          </div>
        </Form>
      </CustomModal>
    </>
  );
}

export default Profile;

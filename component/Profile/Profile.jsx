import { Col, Form, Input, Row, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ShareIcon } from "../../assets/icons";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import CustomModal from "../common/CustomModal";
import CustomPopover from "../common/CustomPopover";
import DefaultImages from "../common/DefaultImages";

const datePattern = "DD/MM/YYYY";

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
        console.log(err.response.data?.message);
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
          orgForm.setFieldsValue({
            applaud_count: response.data.organization.applaud_count ?? 0,
          });
          setApplaudLimit(response.data.organization.applaud_count);
        }
      })
      .catch((err) => {
        console.log(err.response.data?.message);
        openNotificationBox("error", err.response.data?.message, 3);
      });
  };

  return loading ? (
    <div className="grid grid-cols-1 xl:grid-cols-6 mt-1">
      <div className="xl:col-start-1 xl:col-end-7 px-4 ">
        <div className="w-full bg-white rounded-md  shadow-md p-4 mt-2">
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
      <div className="profile-wrapper">
        <Row gutter={[32, 32]}>
          <Col md={24} xs={24}>
            <div className="bg-white relative rounded-md overflow-hidden transition-all duration-300 ease-in-out shadow-md h-auto lg:h-64">
              <div className="relative h-48">
                <Image
                  src={"/media/images/profile-cover.webp"}
                  alt="profileCover"
                  layout="fill"
                />
              </div>
              <div className="px-2 py-2 text-center absolute top-5 right-0 left-0 lg:-bottom-1 lg:top-auto lg:right-auto lg:left-12">
                <div className="w-20 mx-auto ">
                  <div className="rounded-full">
                    <DefaultImages
                      imageSrc={userDetails?.image}
                      width={80}
                      height={80}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-lg font-semibold text-center text-white lg:text-primary md:text-left mb-0">
                    {userDetails?.user?.first_name}
                  </span>
                </div>
              </div>

              <div className="md:flex justify-end items-center px-2 md:px-4">
                <div className="flex flex-wrap justify-between items-center pb-2 md:pb-0">
                  <div className="text-center m-2">
                    <p className="text-xl font-extrabold mb-0">
                      {givenApplaudList?.length}
                    </p>
                    <p className="text-sm md:text-base font-medium mb-0">
                      Appalud Given
                    </p>
                  </div>
                  <div className="text-center m-2">
                    <p className="text-xl font-extrabold mb-0">
                      {receivedApplaudList?.length}
                    </p>
                    <p className="text-sm md:text-base font-medium mb-0">
                      Appalud Received
                    </p>
                  </div>

                  <SecondaryButton
                    withLink={true}
                    linkHref={"/profile/edit"}
                    className="text-md px-8 lg:ml-2 rounded-md"
                    title="Edit Profile"
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col md={10} xs={24}>
            <div className="bg-white rounded-md transition-all duration-300 ease-in-out shadow-md p-6 xl:p-8 space-y-4">
              <p className="mb-2 text-lg text-primary font-semibold">
                General Information
              </p>

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
                  Website
                </p>

                <a
                  target="_blank"
                  href="https://zasyasolutions.com/"
                  rel="noopener noreferrer"
                  className="text-sm 2xl:text-base font-medium text-gray-600 mb-1"
                >
                  https://zasyasolutions.com
                </a>
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
              <div className="bg-white rounded-md transition-all duration-300 ease-in-out shadow-md p-6 xl:p-8 space-y-4 mt-4">
                <p className="mb-2 text-lg text-primary font-semibold">
                  Applaud Information
                </p>
                <div className="">
                  <p className="text-sm 2xl:text-base text-primary font-semibold mb-1 flex items-center">
                    Applaud Limit
                    <span className="leading-[0] ml-2">
                      {CustomPopover(
                        "Count of Applauds that can be given by members in a month."
                      )}
                    </span>
                  </p>

                  <p className="text-sm 2xl:text-base font-medium mb-1 flex items-center justify-between text-gray-600">
                    {applaudLimit}{" "}
                    <span
                      onClick={() => setOrganizationModal(true)}
                      className="font-medium cursor-pointer"
                    >
                      Edit{" "}
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </Col>

          <Col md={14} xs={24}>
            <div className=" profile-applaud-card no-scrollbar">
              {receivedApplaudList.length > 0
                ? receivedApplaudList.map((item, idx) => {
                    return (
                      <div
                        className="bg-white rounded-md transition-all duration-300 ease-in-out shadow-md mb-4  "
                        key={idx + "applaud"}
                      >
                        <div className="p-6 xl:p-8">
                          <div className="m-2">
                            <Row gutter={8}>
                              <Col md={6} xs={6}>
                                <div className=" w-14">
                                  <DefaultImages
                                    imageSrc={item?.created?.UserDetails?.image}
                                    width={60}
                                    height={60}
                                  />
                                </div>
                              </Col>
                              <Col md={12} xs={6}>
                                <div>
                                  <p className="text-base font-semibold mb-1">
                                    {item.created.first_name}{" "}
                                  </p>
                                  <p className="font-medium mb-1">
                                    {moment(item.created_date).format(
                                      datePattern
                                    )}
                                  </p>
                                </div>
                              </Col>
                              <Col md={6} xs={6}>
                                <div
                                  className="flex justify-end cursor-pointer"
                                  onClick={() => shareLinkedinUrl(item)}
                                >
                                  <div className="bg-red-400 py-2 px-2 rounded-full w-10">
                                    <ShareIcon />
                                  </div>
                                </div>
                              </Col>
                              <Col md={24} xs={24}>
                                <div className="mt-4">
                                  <p className="text-base font-normal mb-0">
                                    {item?.comment}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </Col>
        </Row>
      </div>

      <CustomModal
        title="Update Applaud Limit"
        visible={organizationModal}
        onCancel={() => setOrganizationModal(false)}
        footer={[
          <>
            <SecondaryButton
              onClick={() => setOrganizationModal(false)}
              className="rounded h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => orgForm.submit()}
              className=" h-full rounded "
              title="Update"
            />
          </>,
        ]}
        customFooter
        modalProps={{ wrapClassName: "view_form_modal" }}
      >
        <div>
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
        </div>
      </CustomModal>
    </>
  );
}

export default Profile;

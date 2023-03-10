import {
  CrownOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  PhoneOutlined,
  SlackOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Input, Skeleton, Timeline } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ColoFollowUpIcon, ColorApplaudIcon } from "../../assets/icons";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import { URLS } from "../../constants/urls";
import randomBgColor from "../../helpers/randomBgColor";
import { getFirstLetter } from "../../helpers/truncateString";
import httpService from "../../lib/httpService";
import CustomModal from "../common/CustomModal";
import DefaultImages from "../common/DefaultImages";
import { ProfileDetailCard } from "./component/ProfileDetailCard";

function Profile({ user, previewMode = false }) {
  const [orgForm] = Form.useForm();
  const [slackForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [organizationModal, setOrganizationModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [applaudLimit, setApplaudLimit] = useState(0);
  const [activityList, setActivityList] = useState([]);
  const [showSlackEditModal, setShowSlackEditModal] = useState(false);

  const getProfileData = async (userId) => {
    setUserDetails({});
    setLoading(true);
    await httpService
      .get(`/api/profile/${userId}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserDetails(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  async function fetchActivityData(userId) {
    setActivityList([]);
    await httpService
      .get(`/api/activity/${userId}`)
      .then(({ data: res }) => {
        setActivityList(res.data);
      })
      .catch((err) => {
        setActivityList([]);
      });
  }

  useEffect(() => {
    if (previewMode) {
      getProfileData(user);
      fetchActivityData(user);
    } else {
      getProfileData(user.id);
      fetchActivityData(user.id);

      if (user.role_id === 2) fetchOrgData();
    }
  }, [user]);

  const onChangeOrgData = async (values) => {
    await httpService
      .put(`/api/profile/organization`, {
        applaud_count: Number(values.applaud_count),
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
      .get(`/api/profile/organization`)
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

  function handleEditSlack() {
    setShowSlackEditModal(true);
    slackForm.setFieldsValue({
      slack_email: userDetails?.slack_email,
    });
  }

  const onChangeSlack = async (values) => {
    await httpService
      .post(`/api/profile/slack/${user.id}`, values)
      .then(({ data: response }) => {
        if (response.status === 200) {
          slackForm.resetFields();
          setShowSlackEditModal(false);
          openNotificationBox("success", response.message, 3);
          getProfileData();
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message, 3);
      });
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-2 xl:mb-4 ">
        <p className="text-xl font-semibold mb-0">My Profile</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2">
            <Skeleton active />
          </div>
          <div className="col-span-2 w-full bg-white rounded-md  shadow-md p-5 mt-2">
            <Skeleton active />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white relative rounded-md overflow-hidden transition-all duration-300 ease-in-out shadow-md p-3 lg:py-5 lg:px-4 space-y-4">
            <div className="text-center space-y-2">
              <div className="relative rounded-full shadow-md w-24 h-24 overflow-hidden  mx-auto">
                <DefaultImages imageSrc={userDetails?.image} layout="fill" />
              </div>
              <div className="font-semibold ">
                {userDetails?.user?.first_name}
                <div className="font-medium text-primary-green">
                  {userDetails?.user?.role?.name},
                  {userDetails?.user?.organization?.company_name}
                </div>
              </div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-4 gap-4 py-4">
                <div className="col-span-1 grid place-content-center">
                  <HomeOutlined className="text-xl" />
                </div>
                <div className="col-span-3 ">
                  <p className="font-semibold text-17 mb-0">Address </p>
                  <p className="text-gray-500 break-all">
                    {userDetails?.address1} {userDetails?.address2}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 py-4">
                <div className="col-span-1 grid place-content-center">
                  <PhoneOutlined className="text-xl" rotate={90} />
                </div>
                <div className="col-span-3 ">
                  <p className="font-semibold text-17 mb-0">Phone No </p>
                  <p className="text-gray-500">{userDetails?.mobile}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 py-4">
                <div className="col-span-1 grid place-content-center">
                  <UserOutlined className="text-xl" />
                </div>
                <div className="col-span-3 ">
                  <p className="font-semibold text-17 mb-0">About </p>
                  <p className="text-gray-500 break-all">
                    {userDetails?.about}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 py-4">
                <div className="col-span-1 grid place-content-center">
                  <SlackOutlined className="text-xl" />
                </div>
                <div className="col-span-3 ">
                  <p className="font-semibold text-17 mb-0 flex justify-between items-center">
                    <span>Slack Email</span>
                    {!previewMode && (
                      <span
                        className=" cursor-pointer transition-all  duration-300 ease-in-out"
                        onClick={() => handleEditSlack()}
                      >
                        <EditOutlined className="text-sm pr-2" />
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500">{userDetails?.slack_email}</p>
                </div>
              </div>
              {user.role_id === 2 && user.organization_id && !previewMode && (
                <div className="grid grid-cols-4 gap-4 py-4">
                  <div className="col-span-1 grid place-content-center">
                    <ColorApplaudIcon color="#000000" className="text-xl" />
                  </div>
                  <div className="col-span-3 ">
                    <p className="font-semibold text-17 mb-0 flex justify-between items-center">
                      <span>Applaud Limit</span>
                      <span
                        className=" cursor-pointer transition-all  duration-300 ease-in-out"
                        onClick={() => handleEditApplaudLimit(applaudLimit)}
                      >
                        <EditOutlined className="text-sm pr-2" />
                      </span>
                    </p>
                    <p className="text-gray-500">{applaudLimit}</p>
                  </div>
                </div>
              )}
              {!previewMode && (
                <div className="grid place-content-center pt-4">
                  <PrimaryButton
                    withLink={true}
                    className=" h-full  "
                    title={"Edit Profile"}
                    linkHref={URLS.PROFILE_EDIT}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2  bg-white relative rounded-md overflow-hidden transition-all duration-300 ease-in-out shadow-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x border-b ">
              <ProfileDetailCard
                title={"Review"}
                count={userDetails?.user?.taskReviewBy?.length ?? 0}
                className="p-3 lg:py-5 lg:px-4"
                Icon={() => <FileTextOutlined />}
                iconClassName={"text-brandOrange-100 bg-brandOrange-10 text-lg"}
              />
              <ProfileDetailCard
                title={"Goal"}
                count={userDetails?.user?.Goals?.length ?? 0}
                className=""
                Icon={() => <CrownOutlined />}
                iconClassName={"text-brandGreen-100 bg-brandGreen-10 text-lg"}
              />
              <ProfileDetailCard
                title={"Applaud"}
                count={userDetails?.user?.userCreated?.length ?? 0}
                className=""
                Icon={() => <ColorApplaudIcon color="#0091f6" />}
                iconClassName={"text-brandBlue-100 bg-brandBlue-10 "}
              />
              <ProfileDetailCard
                title={"Follow Up"}
                count={userDetails?.user?.Meetings?.length ?? 0}
                className=""
                Icon={() => <ColoFollowUpIcon color="#C77700" />}
                iconClassName={"text-brandOrange-500 bg-brandOrange-500 "}
              />
            </div>
            {Number(activityList.length) > 0 && (
              <Timeline className=" pl-8  space-y-2  p-4 profile-timeline overflow-auto no-scrollbar">
                {activityList.map((item, index) => (
                  <Timeline.Item
                    dot={
                      <div
                        className={
                          " text-white capitalize rounded-full w-9 h-9 grid place-content-center"
                        }
                        style={{ backgroundColor: randomBgColor(index * 3) }}
                      >
                        {getFirstLetter(item.type)}
                      </div>
                    }
                    className="recent-activity-timeline"
                    key={item.id + index + "activity"}
                  >
                    <div className="px-3">
                      <p className="flex-1 font-semibold mb-0 text-base capitalize">
                        {item.title}
                      </p>
                      <p className="flex-1  mb-0 text-sm ">
                        {item.description}
                      </p>
                      {item.created_date && (
                        <p className="mt-1 mb-0   text-xs leading-6 ">
                          {moment(item.created_date).fromNow()}
                        </p>
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </div>
        </div>
      )}

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

      <CustomModal
        title="Update Slack Email"
        visible={showSlackEditModal}
        onCancel={() => setShowSlackEditModal(false)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setShowSlackEditModal(false)}
              className=" h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => slackForm.submit()}
              className="h-full"
              title="Update"
            />
          </>,
        ]}
        modalProps={{ wrapClassName: "view_form_modal" }}
      >
        <Form
          form={slackForm}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            slack_email: userDetails?.slack_email,
          }}
          onFinish={onChangeSlack}
        >
          <Form.Item
            label="Slack Email Address "
            name="slack_email"
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <Input
              placeholder="Slack Email Address"
              className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
            />
          </Form.Item>
        </Form>
      </CustomModal>
    </>
  );
}

export default Profile;

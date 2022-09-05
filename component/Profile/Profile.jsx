import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Col,
  Row,
  Upload,
  message,
  Skeleton,
  Checkbox,
} from "antd";
import { useEffect } from "react";
import { openNotificationBox } from "../../component/common/notification";
import Image from "next/image";
import { ShareIcon } from "../../assets/icons";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useS3Upload } from "next-s3-upload";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import ImgCrop from "antd-img-crop";
import httpService from "../../lib/httpService";
import CustomPopover from "../common/CustomPopover";
import DefaultImages from "../common/DefaultImages";

const datePattern = "DD/MM/YYYY";

const getSrcFromFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};

const notificationOptions = [
  {
    label: "Mail",
    value: "mail",
  },
  {
    label: "Slack",
    value: "slack",
  },
];

const BASE = process.env.NEXT_PUBLIC_APP_URL;
const ImageUpload = ({
  category,
  fileList,
  setFileList,
  formName,
  limit = true,
  limitSize = 1,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  // const [previewVisible, setPreviewVisible] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const [previewTitle, setPreviewTitle] = useState("");

  const uploadImageButton = !isUploading ? (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload </div>
    </div>
  ) : (
    <div className="ant-upload-text">Loading... </div>
  );

  function beforeUpload(file) {
    const checkJpgOrPng =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";
    if (!checkJpgOrPng) {
      message.error("You can only upload jpg, jpeg and png file!");
    }

    const checkFileSize = file.size < 1126400;
    if (!checkFileSize) {
      message.error(" Image must be smaller than 1Mb!");
    }

    return checkJpgOrPng && checkFileSize;
  }

  // function getImages(file) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // }

  function handleChange(info) {
    if (info.file.status === "uploading") {
      setFileList(info.fileList);
      setIsUploading(false);
    }
    if (info.file.status === "removed") {
      setIsUploading(false);
      setFileList(info.fileList);
    }
    if (info.file.status === "error") {
      setIsUploading(false);
      return;
    }
    if (info.file.status === "done") {
      setFileList(info.fileList);
      setIsUploading(false);
    }
  }

  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getImages(file.originFileObj);
  //   }
  //   setPreviewVisible(true);
  //   setPreviewImage(file.url || file.preview);

  //   setPreviewTitle(file.name);
  // };

  const onPreview = async (file) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
  };

  return (
    <>
      <Form.Item name={formName} label="Profile Image">
        <ImgCrop
          zoom
          rotate={false}
          shape="round"
          modalClassName="image_crop_modal"
        >
          <Upload
            name="image"
            listType="picture-card"
            fileList={fileList}
            // action={handleFileChange}
            onChange={handleChange}
            onPreview={onPreview}
            data={{ category: category }}
            // onRemove={(val) => deleteBanner(val.uid)}
            beforeUpload={beforeUpload}
          >
            {limit
              ? fileList.length >= limitSize
                ? null
                : uploadImageButton
              : uploadImageButton}
          </Upload>
        </ImgCrop>
      </Form.Item>
    </>
  );
};
function Profile({ user }) {
  const { uploadToS3 } = useS3Upload();
  const [passwordForm] = Form.useForm();
  const [slackForm] = Form.useForm();
  const [orgForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSlackEditModal, setShowSlackEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [organizationModal, setOrganizationModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [applaudLimit, setApplaudLimit] = useState(0);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);
  const [givenApplaudList, setGivenApplaudList] = useState([]);
  const [image, setImage] = useState([]);

  const showPasswordEditModal = () => {
    setIsModalVisible(true);
  };

  let handleFileChange = async (file) => {
    let { url } = await uploadToS3(file);

    if (url) {
      return url;
    }
    return;
  };

  const onFinish = async (values) => {
    if (image.length) {
      if (image[0]?.originFileObj) {
        let imageURL = await handleFileChange(image[0].originFileObj);
        values.imageName = imageURL;
      } else {
        values.imageName = image[0].url;
      }
    } else {
      values.imageName = "";
    }
    profileUpdate(values);
  };

  const profileUpdate = async (data) => {
    await httpService
      .post(`/api/profile/${user.id}`, data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          profileForm.resetFields();
          openNotificationBox("success", response.message, 3);
          getProfileData();
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.error(err.response.data.message));
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const getProfileData = async () => {
    setUserDetails({});
    setLoading(true);
    await httpService
      .get(`/api/profile/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserDetails(response.data);
          profileForm.setFieldsValue({
            first_name: response.data.user.first_name,
            address1: response.data.address1 ?? "",
            about: response.data.about ?? "",
            address2: response.data.address2 ?? "",
            mobile: response.data.mobile ?? "",
            pin_code: response.data.pin_code ?? "",
            notification: response.data.notification ?? [],
          });
          slackForm.setFieldsValue({
            slack_email: response.data.slack_email ?? "",
          });
          setImageHandler(response.data.image);

          setEditMode(false);
          setLoading(false);
        }
      })
      .catch((err) => console.error(err.response.data.message));
  };

  const setImageHandler = (img) => {
    if (img) {
      let array = [];

      array.push({
        uid: img,
        name: "slide.jpg",
        status: "done",
        url: img,
        response: {
          status: 200,
          data: {
            filepaths: [img],
          },
        },
        // originFileObj: img,
      });

      setImage(array);
    }
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
        console.error(err.response.data.message);
      });
  }

  useEffect(() => {
    getProfileData();
    fetchApplaudData();
    if (user.role_id === 2) fetchOrgData();
  }, []);

  async function onChangePassword(values) {
    let obj = {
      old_password: values.old_password,
      new_password: values.new_password,
    };

    await httpService
      .post(`/api/user/password/${user.id}`, obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          passwordForm.resetFields();
          setIsModalVisible(false);
          openNotificationBox("success", response.message, 3);
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data.message);
      });
  }

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

  const onDeleteImage = () => {
    setImage([]);
  };

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
        console.log(err.response.data.message);
        openNotificationBox("error", err.response.data.message, 3);
      });
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
        console.log(err.response.data.message);
        openNotificationBox("error", err.response.data.message, 3);
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
        console.log(err.response.data.message);
        openNotificationBox("error", err.response.data.message, 3);
      });
  };

  return loading ? (
    <div className="px-3 md:px-8 h-auto">
      <div className="grid grid-cols-1 xl:grid-cols-6 mt-1">
        <div className="xl:col-start-1 xl:col-end-7 px-4 ">
          <div className="w-full bg-white rounded-xl  shadow-md p-4 mt-2">
            <Row gutter={16}>
              <Col lg={24} xs={24} className="mt-4 items-center">
                <Skeleton active />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      {editMode ? (
        <div className="px-3 md:px-8 h-auto">
          <div className="grid grid-cols-1 xl:grid-cols-6 mt-1">
            <div className="xl:col-start-1 xl:col-end-7 px-4 ">
              <div className="rounded-xl text-white grid items-center w-full shadow-lg-purple my-3">
                <div className="w-full flex item-center justify-end">
                  <div className="flex justify-end ">
                    <div className="mr-2">
                      <SecondaryButton
                        onClick={() => setShowSlackEditModal(true)}
                        className="rounded h-full md:w-full w-32 mr-2"
                        title="Change Slack Email"
                      />
                    </div>
                    <div>
                      <PrimaryButton
                        onClick={() => showPasswordEditModal()}
                        className="md:px-4 px-2 rounded-md md:w-full w-24"
                        title="Change Password"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white rounded-xl  shadow-md p-4 ">
                <Row gutter={16}>
                  <Col lg={24} xs={24} className="mt-4 items-center">
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={onFinish}
                      validateMessages={validateMessages}
                      initialValues={{
                        notification: ["mail"],
                      }}
                    >
                      <Row gutter={16} justify="center">
                        <Col md={4} xs={24}>
                          <Row justify="center">
                            <Col md={24} xs={24}>
                              <ImageUpload
                                category="profile"
                                fileList={image}
                                setFileList={setImage}
                                formName="profileImage"
                                onDelete={onDeleteImage}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col md={12} xs={24}>
                          <Row>
                            <Col md={24} xs={24}>
                              <Form.Item
                                label="Name"
                                name="first_name"
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Name"
                                  className="bg-gray-100 h-12 rounded-md"
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} sm={24} xs={24}>
                              <Form.Item
                                label="Address Line 1"
                                name="address1"
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Address Line 1"
                                  className="bg-gray-100 h-12 rounded-md"
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} sm={24} xs={24}>
                              <Form.Item
                                label="Address Line 2"
                                name="address2"
                                // rules={[
                                //   {
                                //     required: true,
                                //   },
                                // ]}
                              >
                                <Input
                                  placeholder="Address Line 2"
                                  className="bg-gray-100 h-12 rounded-md"
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} sm={24} xs={24}>
                              <Form.Item
                                label="Phone Number"
                                name="mobile"
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Mobile"
                                  className="bg-gray-100 h-12 rounded-md"
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} sm={24} xs={24}>
                              <Form.Item
                                label="About "
                                name="about"
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="About You"
                                  className="bg-gray-100 h-12 rounded-md"
                                />
                              </Form.Item>
                            </Col>
                            <Col md={24} sm={24} xs={24}>
                              <Form.Item
                                label="Notification Method "
                                name="notification"
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Checkbox.Group options={notificationOptions} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <div className="text-center">
                        <SecondaryButton
                          onClick={() => setEditMode(false)}
                          className="rounded h-full w-32 mr-2"
                          title="Cancel"
                        />
                        <PrimaryButton
                          btnProps={{ htmlType: "submit" }}
                          className=" h-full w-32 rounded "
                          title="Submit"
                        />
                      </div>
                    </Form>
                  </Col>
                </Row>
                <div className="p-4 ">
                  <div className="border-t border-lightBlue-200 text-center px-2 ">
                    <p className="text-blue-gray-700 text-lg font-light leading-relaxed mt-6 mb-4"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 md:px-8 m-4 profile-wrapper">
          <Row gutter={[16, 16]}>
            <Col md={24} xs={24}>
              <div className="bg-white rounded-sm transition-all duration-300 ease-in-out shadow-md h-64">
                <div className="relative h-48">
                  <Image
                    src={"/media/images/profile-cover.webp"}
                    alt="profileCover"
                    layout="fill"
                  />
                </div>

                <div className=" block md:flex justify-end items-center">
                  <div className="px-2 py-2 image-absolute">
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
                      <p className="text-lg font-semibold text-center md:text-left mb-0">
                        {userDetails?.user?.first_name}
                      </p>
                    </div>
                  </div>

                  <div className=" block md:flex justify-between items-center pb-2 md:pb-0">
                    <div className="flex px-4 py-2">
                      <div className="text-center mx-2">
                        <p className="text-xl font-extrabold mb-0">
                          {givenApplaudList?.length}
                        </p>
                        <p className="text-base font-medium mb-0">
                          Appalud Given
                        </p>
                      </div>
                      <div className="text-center mx-2">
                        <p className="text-xl font-extrabold mb-0">
                          {receivedApplaudList?.length}
                        </p>
                        <p className="text-base font-medium mb-0">
                          Appalud Received
                        </p>
                      </div>
                    </div>
                    <div className="flex  justify-center md:mx-4">
                      <SecondaryButton
                        withLink={false}
                        onClick={() => setEditMode(true)}
                        className="text-md px-8 rounded-md"
                        title="Edit Profile"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={8} xs={24}>
              <div className="bg-white rounded-sm transition-all duration-300 ease-in-out shadow-md ">
                <div className="p-4">
                  <div className="m-2">
                    <p className="text-base font-semibold mb-1">About</p>
                    <p className="text-base font-normal mb-1">
                      {userDetails?.about}
                    </p>
                  </div>
                  <div className="m-2">
                    <p className="text-base font-semibold mb-1">Address</p>
                    <p className="text-base font-normal mb-1">
                      {userDetails?.address1} {userDetails?.address2}
                    </p>
                  </div>
                  <div className="m-2">
                    <p className="text-base font-semibold mb-1">Phone No.</p>
                    <p className="text-base font-normal mb-1">
                      {userDetails?.mobile}
                    </p>
                  </div>
                  <div className="m-2">
                    <p className="text-base font-semibold mb-1">Website</p>

                    <a
                      target="_blank"
                      href="https://zasyasolutions.com/"
                      rel="noopener noreferrer"
                    >
                      <p className="text-base font-normal mb-1">
                        https://zasyasolutions.com
                      </p>
                    </a>
                  </div>
                  {user.role_id === 2 && user.organization_id ? (
                    <div className="m-2">
                      <p className="text-base font-semibold mb-1 flex items-center">
                        Applaud Limit
                        <span className="leading-[0] ml-2">
                          {CustomPopover(
                            "Count of Applauds that can be given by members in a month."
                          )}
                        </span>
                      </p>

                      <p className="text-base font-normal mb-1 flex items-center justify-between">
                        {applaudLimit}{" "}
                        <span
                          onClick={() => setOrganizationModal(true)}
                          className="font-semibold cursor-pointer"
                        >
                          Edit{" "}
                        </span>
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Col>

            <Col md={10} xs={24}>
              <div className="custom-scrollbar profile-applaud-card">
                {receivedApplaudList.length > 0
                  ? receivedApplaudList.map((item, idx) => {
                      return (
                        <div
                          className="bg-white rounded-sm transition-all duration-300 ease-in-out shadow-md mb-4  "
                          key={idx + "applaud"}
                        >
                          <div className="p-4">
                            <div className="m-2">
                              <Row gutter={8}>
                                <Col md={6} xs={6}>
                                  <div className=" w-14">
                                    <DefaultImages
                                      imageSrc={
                                        item?.created?.UserDetails?.image
                                      }
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
      )}

      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <>
            <SecondaryButton
              onClick={() => setIsModalVisible(false)}
              className="rounded h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => passwordForm.submit()}
              className=" h-full rounded "
              title="Change Password"
            />
          </>,
        ]}
        wrapClassName="view_form_modal"
      >
        <div>
          <Form
            form={passwordForm}
            layout="vertical"
            autoComplete="off"
            onFinish={onChangePassword}
          >
            <div className=" mx-2">
              <Form.Item
                label="Old Password"
                name="old_password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Old password!",
                  },
                ]}
              >
                <Input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                  placeholder="Old Password"
                />
              </Form.Item>
            </div>

            <div className=" mx-2">
              <Form.Item
                label="New Password"
                name="new_password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your New password!",
                  },
                ]}
              >
                <Input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                  placeholder="New Password"
                />
              </Form.Item>
            </div>

            <div className=" mx-2">
              <Form.Item
                label="Confirm Password"
                name="confirm_password"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input
                  type="password"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                  placeholder="Confirm Password"
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        title="Change Slack Email"
        visible={showSlackEditModal}
        onCancel={() => setShowSlackEditModal(false)}
        footer={[
          <>
            <SecondaryButton
              onClick={() => setShowSlackEditModal(false)}
              className="rounded h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => slackForm.submit()}
              className=" h-full rounded "
              title="Change Email"
            />
          </>,
        ]}
        wrapClassName="view_form_modal"
      >
        <div>
          <Form
            form={slackForm}
            layout="vertical"
            autoComplete="off"
            onFinish={onChangeSlack}
          >
            <div className=" mx-2">
              <Form.Item label="Slack Email Address " name="slack_email">
                <Input
                  placeholder="Slack Email Address"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        title="Change Applaud Limit"
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
              title="Change Limit"
            />
          </>,
        ]}
        wrapClassName="view_form_modal"
      >
        <div>
          <Form
            form={orgForm}
            layout="vertical"
            autoComplete="off"
            onFinish={onChangeOrgData}
          >
            <div className=" mx-2">
              <Form.Item label="Applaud Limit " name="applaud_count">
                <Input
                  placeholder=" Applaud Limit"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                  type="number"
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default Profile;

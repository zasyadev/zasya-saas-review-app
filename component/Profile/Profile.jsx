import React, { useState } from "react";
import { Modal, Form, Input, Button, Col, Row, Upload, message } from "antd";
import { useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
import Image from "next/image";
import profileCover from "../../assets/images/profile-cover.png";
import userImage from "../../assets/images/User1.png";
import { ShareIcon } from "../../assets/Icon/icons";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";
import { useS3Upload } from "next-s3-upload";

const datePattern = "DD/MM/YYYY";
const ImageUpload = ({
  category,
  fileList,
  setFileList,
  formName,
  limit = true,
  limitSize = 1,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

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

  function getImages(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

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

  return (
    <>
      <Form.Item name={formName} label="Image Upload">
        <Upload
          name="image"
          listType="picture-card"
          fileList={fileList}
          // action={handleFileChange}
          onChange={handleChange}
          // onPreview={handlePreview}
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
      </Form.Item>
    </>
  );
};
function Profile({ user }) {
  const { uploadToS3 } = useS3Upload();
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);
  const [givenApplaudList, setGivenApplaudList] = useState([]);
  const [image, setImage] = useState([]);

  const showModal = () => {
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
    if (values.profileImage) {
      let imageURL = await handleFileChange(image[0].originFileObj);
      values.imageName = imageURL;
      profileUpdate(values);
    } else {
      values.imageName = "";
      profileUpdate(values);
    }
  };

  const profileUpdate = async (data) => {
    await fetch("/api/profile/" + user.id, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          profileForm.resetFields();
          openNotificationBox("success", response.message, 3);
          getProfileData();
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const getProfileData = async () => {
    setUserDetails({});
    await fetch("/api/profile/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setUserDetails(response.data);
          profileForm.setFieldsValue({
            first_name: response.data.user.first_name,
            address1: response.data.address1 ?? "",
            about: response.data.about ?? "",
            address2: response.data.address2 ?? "",
            mobile: response.data.mobile ?? "",
            pin_code: response.data.pin_code ?? "",
          });
          setImageHandler(response.data.image);

          setEditMode(false);
        }
      })
      .catch((err) => console.log(err));
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
        originFileObj: img,
      });

      setImage(array);
    }
  };

  const fetchReceivedApplaud = async () => {
    setReceivedApplaudList([]);
    await fetch("/api/applaud/" + user.id, {
      method: "POST",
      body: JSON.stringify({
        user: user.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setReceivedApplaudList(res.data);
      })
      .catch((err) => {
        setReceivedApplaudList([]);
      });
  };

  async function fetchGivenApplaud() {
    setGivenApplaudList([]);
    await fetch("/api/applaud/" + user.id, { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        setGivenApplaudList(res.data);
      })
      .catch((err) => {
        setGivenApplaudList([]);
      });
  }

  useEffect(() => {
    if (user) {
      getProfileData();
      fetchReceivedApplaud();
      fetchGivenApplaud();
    }
  }, []);

  async function onChangePassword(values) {
    let obj = {
      old_password: values.old_password,
      new_password: values.new_password,
    };
    await fetch("/api/user/password/" + user.id, {
      method: "POST",
      body: JSON.stringify(obj),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          passwordForm.resetFields();
          setIsModalVisible(false);
          openNotificationBox("success", response.message, 3);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      {editMode ? (
        <div className="px-3 md:px-8 h-auto">
          <div className="grid grid-cols-1 xl:grid-cols-6 mt-1">
            <div className="xl:col-start-1 xl:col-end-7 px-4 ">
              <div className="rounded-xl text-white grid items-center w-full shadow-lg-purple my-3">
                <div className="w-full flex item-center justify-end">
                  <div className="flex justify-end ">
                    <div>
                      <button
                        className="primary-bg-btn text-white text-sm md:py-3 py-3 text-center md:px-4 px-2 rounded-md md:w-full w-20  "
                        onClick={showModal}
                      >
                        Change Password
                      </button>
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
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
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
                          </Row>
                        </Col>
                      </Row>
                      <div className="text-center">
                        <Button
                          className="profile-submit-button py-2 cursor-pointer primary-bg-btn text-white text-base  text-center rounded-md h-full w-32 mr-2"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>

                        <Button
                          className="profile-submit-button py-2 cursor-pointer primary-bg-btn text-white text-base  text-center rounded-md h-full w-32"
                          htmlType="submit"
                        >
                          Submit
                        </Button>
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
              <div className="bg-white rounded-sm transition-all duration-300 ease-in-out shadow-md ">
                <div>
                  <Image
                    src={profileCover}
                    alt="profileCover"
                    layout="responsive"
                  />
                </div>

                <div className=" block md:flex justify-end items-center">
                  <div className="px-2 py-2 image-absolute">
                    <div className="w-20 mx-auto ">
                      <div className="rounded-full">
                        <Image
                          src={
                            userDetails?.image ? userDetails?.image : userImage
                          }
                          alt="userImage"
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-center md:text-left">
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
                      <button
                        className="toggle-btn-bg rounded-md text-md text-white px-8 py-2 "
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={8} xs={24}>
              <div className="bg-white rounded-sm transition-all duration-300 ease-in-out shadow-md mt-8">
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
                    <Link href="https://zasyasolutions.com/" passHref>
                      <a target="_blank">
                        <p className="text-base font-normal mb-1">
                          https://zasyasolutions.com
                        </p>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={10} xs={24}>
              {receivedApplaudList.length > 0
                ? receivedApplaudList.map((item, idx) => {
                    return (
                      <div
                        className="bg-white rounded-sm transition-all duration-300 ease-in-out shadow-md my-8  "
                        key={idx + "applaud"}
                      >
                        <div className="p-4">
                          <div className="m-2">
                            <Row gutter={8}>
                              <Col md={6} xs={6}>
                                <div className=" w-14">
                                  {/* <Image src={userImage} alt="userImage" /> */}
                                  <Image
                                    src={
                                      item?.created?.UserDetails?.image
                                        ? item?.created?.UserDetails?.image
                                        : userImage
                                    }
                                    alt="userImage"
                                    width={60}
                                    height={60}
                                    className="rounded-full"
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
                                <div className="flex justify-end">
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
            <Button
              key="add"
              type="default"
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </Button>
            <Button key="add" type="primary" onClick={passwordForm.submit}>
              Change Password
            </Button>
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
    </>
  );
}

export default Profile;

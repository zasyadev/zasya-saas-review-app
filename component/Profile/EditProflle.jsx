import { PlusOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Skeleton,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useS3Upload } from "next-s3-upload";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import CustomModal from "../common/CustomModal";
const ActionURL = process.env.NEXT_PUBLIC_APP_URL + "api/profile/noop";

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

const ImageUpload = ({
  category,
  fileList,
  setFileList,
  formName,
  limit = true,
  limitSize = 1,
  // handleFileChange
}) => {
  const [isUploading, setIsUploading] = useState(false);

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

  const onPreview = async (file) => {
    try {
      const src = file.url || (await getSrcFromFile(file));
      window.open(src);
    } catch (error) {
      console.error(error);
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
            action={ActionURL}
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
function EditProfile({ user }) {
  const router = useRouter();
  const { uploadToS3 } = useS3Upload();
  const [passwordForm] = Form.useForm();
  const [slackForm] = Form.useForm();
  const [apiLoading, setApiLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    address1: "",
    about: "",
    address2: "",
    mobile: "",
    pin_code: "",
    notification: [],
    slack_email: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSlackEditModal, setShowSlackEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setApiLoading(true);
    await httpService
      .post(`/api/profile/${user.id}`, data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          window.location.href = process.env.NEXT_PUBLIC_APP_URL + "/profile";
        }
      })
      .catch((err) => setApiLoading(false));
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const getProfileData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/profile/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setUserDetails({
            first_name: response.data.user.first_name,
            address1: response.data.address1 ?? "",
            about: response.data.about ?? "",
            address2: response.data.address2 ?? "",
            mobile: response.data.mobile ?? "",
            pin_code: response.data.pin_code ?? "",
            notification: response.data.notification ?? [],
            slack_email: response.data.slack_email ?? "",
          });
          setImageHandler(response.data.image);
        }
        setLoading(false);
      })
      .catch((err) => console.error(err?.response?.data?.message));
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

  useEffect(() => {
    getProfileData();
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
        openNotificationBox("error", err.response.data?.message);
      });
  }

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
        openNotificationBox("error", err.response.data?.message, 3);
      });
  };

  function handleEditSlack() {
    slackForm.setFieldsValue({
      slack_email: userDetails.slack_email,
    });
    setShowSlackEditModal(true);
  }

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
      <div className="grid grid-cols-1 xl:grid-cols-6">
        <div className="xl:col-start-1 xl:col-end-7 px-4 ">
          <div className="rounded-md text-white grid items-center w-full shadow-lg-purple mb-4 md:mb-6">
            <div className="w-full flex item-center justify-end">
              <div className="flex justify-end ">
                <div className="mr-4">
                  <SecondaryButton
                    onClick={() => handleEditSlack()}
                    className="h-full md:w-full w-32 mr-2"
                    title="Change Slack Email"
                  />
                </div>
                <div>
                  <PrimaryButton
                    onClick={() => showPasswordEditModal()}
                    className="md:px-4 px-2 md:w-full w-24"
                    title="Change Password"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-md  shadow-md px-2 py-3 md:px-4 md:py-6">
            <Row gutter={16}>
              <Col lg={24} xs={24} className=" items-center">
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  validateMessages={validateMessages}
                  initialValues={{
                    first_name: userDetails?.first_name,
                    address1: userDetails?.address1,
                    about: userDetails?.about,
                    address2: userDetails?.address2,
                    mobile: userDetails?.mobile,
                    pin_code: userDetails?.pin_code,
                    notification: userDetails?.notification,
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
                          <Form.Item label="Address Line 2" name="address2">
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
                  <div className="text-center space-x-4">
                    <SecondaryButton
                      withLink={true}
                      className=" h-full w-32"
                      linkHref={"/profile"}
                      title="Cancel"
                    />
                    <PrimaryButton
                      type="submit"
                      disabled={apiLoading}
                      className=" h-full w-32  "
                      title="Submit"
                    />
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <CustomModal
        title="Change Password"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setIsModalVisible(false)}
              className=" h-full mr-2"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => passwordForm.submit()}
              className=" h-full  "
              title="Change Password"
            />
          </>,
        ]}
        modalProps={{ wrapClassName: "view_form_modal" }}
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
      </CustomModal>

      <CustomModal
        title="Change Slack Email"
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
              className=" h-full  "
              title="Change Email"
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

export default EditProfile;

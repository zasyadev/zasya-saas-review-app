import { Checkbox, Form, Input, Skeleton } from "antd";
import { useS3Upload } from "next-s3-upload";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import {
  maxLengthValidator,
  phoneValidator,
} from "../../helpers/formValidations";
import getErrors from "../../helpers/getErrors";
import httpService from "../../lib/httpService";
import { CustomTextArea } from "../common/CustomFormFeilds";
import CustomModal from "../common/CustomModal";
import ImageUpload from "./component/ImageUpload";

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

function EditProfile({ user }) {
  const { uploadToS3 } = useS3Upload();
  const [passwordForm] = Form.useForm();
  const [apiLoading, setApiLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    address1: "",
    about: "",
    address2: "",
    mobile: "",
    pin_code: "",
    notification: ["mail"],
    slack_email: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);
  const showPasswordEditModal = () => {
    setIsModalVisible(true);
  };

  let handleFileChange = async (file) => {
    let { url } = await uploadToS3(file);
    if (!url) return;
    return url;
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
        openNotificationBox("success", response.message, 3);
        window.location.href = process.env.NEXT_PUBLIC_APP_URL + "/profile";
      })
      .catch((err) => {
        setApiLoading(false);
        if (
          err?.response?.status === 400 &&
          Number(err?.response?.data?.inner?.length) > 0
        ) {
          const errorNode = getErrors(err?.response?.data?.inner);
          openNotificationBox("error", "Errors", 5, "error-reg", errorNode);
        } else openNotificationBox("error", err.response.data?.message);
      });
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const getProfileData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/profile/${user.id}`)
      .then(({ data: response }) => {
        setUserDetails({
          first_name: response.data.user.first_name,
          email: response.data.user.email,
          address1: response.data.address1 ?? "",
          about: response.data.about ?? "",
          address2: response.data.address2 ?? "",
          mobile: response.data.mobile ?? "",
          pin_code: response.data.pin_code ?? "",
          notification: response.data.notification ?? ["mail"],
          slack_email: response.data.slack_email ?? "",
        });
        setImageHandler(response.data.image);
      })
      .catch((err) => openNotificationBox("error", err.response.data?.message))
      .finally(() => setLoading(false));
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
      .post(`/api/user/password`, obj)
      .then(({ data: response }) => {
        passwordForm.resetFields();
        setIsModalVisible(false);
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) => openNotificationBox("error", err.response.data?.message));
  }

  const onDeleteImage = () => {
    setImage([]);
  };

  return loading ? (
    <div className="w-full bg-white rounded-md shadow-md p-4 md:p-8">
      <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-2 xl:mb-4 ">
        <p className="text-xl font-semibold mb-0">Edit Profile</p>
      </div>
      <Skeleton.Image active size={"large"} className="mb-4 rounded-full" />
      <Skeleton active />
    </div>
  ) : (
    <>
      <div className="w-full bg-white rounded-md shadow-md p-4 md:p-8 space-y-4 xl:space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-xl font-semibold mb-0">Edit Profile</p>
          <div className=" w-fit">
            <PrimaryButton
              onClick={() => showPasswordEditModal()}
              className="md:px-4 px-2 w-full"
              title="Change Password"
            />
          </div>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={{
            first_name: userDetails.first_name,
            address1: userDetails.address1,
            about: userDetails.about,
            address2: userDetails.address2,
            mobile: userDetails.mobile,
            pin_code: userDetails.pin_code,
            notification: userDetails.notification,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex space-x-4">
              <ImageUpload
                category="profile"
                fileList={image}
                setFileList={setImage}
                formName="profileImage"
                onDelete={onDeleteImage}
              />
              <div className="space-y-2">
                <p className="font-semibold text-lg">
                  {userDetails?.first_name}
                </p>
                <p>{userDetails?.email}</p>
              </div>
            </div>

            <Form.Item
              label="Name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
                {
                  validator: (_, value) => maxLengthValidator(value, 50),
                },
              ]}
            >
              <Input placeholder="Name" className="h-12 rounded-md" />
            </Form.Item>
            {userDetails?.email && (
              <Form.Item label="Email">
                <Input
                  disabled={true}
                  value={userDetails?.email}
                  className="h-12 rounded-md"
                />
              </Form.Item>
            )}
            <Form.Item
              label="Address 1"
              name="address1"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
                {
                  validator: (_, value) => maxLengthValidator(value, 200),
                },
              ]}
            >
              <CustomTextArea
                placeholder="Address 1"
                className=" h-12 rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Address 2"
              name="address2"
              rules={[
                {
                  validator: (_, value) => maxLengthValidator(value, 200),
                },
              ]}
            >
              <CustomTextArea
                placeholder="Address 2"
                className=" h-12 rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="mobile"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Phone Number!",
                },
                {
                  validator: (_, value) => maxLengthValidator(value, 20),
                },
                {
                  validator: (_, value) => phoneValidator(value),
                },
              ]}
            >
              <Input placeholder="Mobile" className=" h-12 rounded-md" />
            </Form.Item>
            <Form.Item
              label="About "
              name="about"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
                {
                  validator: (_, value) => maxLengthValidator(value, 400),
                },
              ]}
            >
              <CustomTextArea
                placeholder="About You"
                className=" h-12 rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Notification Method "
              name="notification"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
              ]}
            >
              <Checkbox.Group options={notificationOptions} />
            </Form.Item>
            <div className="flex items-center justify-center md:justify-end gap-4">
              <SecondaryButton
                withLink={true}
                className="w-32"
                linkHref={"/profile"}
                title="Cancel"
              />
              <PrimaryButton
                type="submit"
                disabled={apiLoading}
                className="w-32"
                title="Submit"
              />
            </div>
          </div>
        </Form>
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
                { min: 6, message: "Password must be minimum 6 characters." },
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
      </CustomModal>
    </>
  );
}

export default EditProfile;

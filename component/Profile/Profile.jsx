import React, { useState } from "react";
import { Modal, Form, Input, Button, Col, Row, Upload, message } from "antd";
import Image from "next/image";
import UserImage from "../../assets/images/User.png";
import UploadButton from "./UploadButton";
import { useEffect } from "react";
import { useForm } from "rc-field-form";

function Profile({ user }) {
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userimageSrc, setuserImageSrc] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const getFieldData = () => {
    profileForm.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  useEffect(() => {
    getFieldData();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />
      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="grid grid-cols-1 xl:grid-cols-6 mt-8">
          <div className="xl:col-start-1 xl:col-end-7 px-4 mb-16">
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
              <div className="flex flex-wrap justify-center">
                <div className="bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white grid items-center w-full h-24 py-4 px-8  shadow-lg-purple ">
                  <div className="w-full flex item-center  justify-between">
                    <h2 className="text-white text-2xl">Details</h2>
                    <div className="">
                      <span
                        className="text-center  rounded-full border-2 ml-3 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                        onClick={showModal}
                      >
                        Change Setting
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Row className="mx-6">
                <Col
                  lg={8}
                  className="flex flex-col items-center justify-center"
                >
                  {/* <div className="mt-4 ">
                    <span className="text-lg font-semibold">Email : </span>
                    <span className="text-base ">{user.email}</span>
                  </div>  */}

                  <div className="flex flex-wrap items-center mb-3">
                    <Image
                      src={userimageSrc ? userimageSrc : UserImage}
                      alt="user_name"
                      width="60"
                      height="60"
                    />
                  </div>
                  <div className="img-upload mb-2 text-center">
                    <p className="font-medium mb-0">Upload your avatar</p>

                    <p className="text-xs text-gray-400 mb-2">
                      Photo should be at least 300px X 300px
                    </p>
                    <p className="mt-5">
                      {/* <Upload name="image" onChange={handleChange}>
                        <Button shape="round" className="text-center">
                          Upload
                        </Button>
                      </Upload> */}
                      <UploadButton
                        onSuccess={(newUploadedfileName) => {
                          setuserImageSrc("/" + newUploadedfileName);
                        }}
                      />
                    </p>
                  </div>
                </Col>

                <Col lg={15} className="mt-4">
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                  >
                    <Row gutter={16}>
                      <Col md={12} sm={24} xs={24}>
                        <Form.Item
                          label="First Name"
                          name="first_name"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input placeholder="First Name" />
                        </Form.Item>
                      </Col>
                      <Col md={12} sm={24} xs={24}>
                        <Form.Item
                          label="Last Name"
                          name="last_name"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input placeholder="Last Name" />
                        </Form.Item>{" "}
                      </Col>
                      <Col md={12} sm={24} xs={24}>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            placeholder="Email"
                            disabled={true}
                            value={user.email}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <Button
                        className="text-center rounded-full border-2  mt-4 ml-3  cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </div>
                    {console.log(profileForm, "profileForm")}
                  </Form>
                </Col>
              </Row>
              <div className="p-4 ">
                <div className="border-t border-lightBlue-200 text-center px-2 ">
                  <p className="text-blue-gray-700 text-lg font-light leading-relaxed mt-6 mb-4"></p>
                </div>
              </div>
              <div className="p-4 ">
                <div className="w-full flex justify-center -mt-8">
                  <a href="#pablo" className="mt-5">
                    <button className="false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal bg-transparent text-purple-500 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100 "></button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Change Password"
        visible={isModalVisible}
        onOk={form.submit}
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
            <Button key="add" type="primary" onClick={form.submit}>
              Change Password
            </Button>
          </>,
        ]}
        wrapClassName="view_form_modal"
      >
        <div>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
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
                      console.log(value, "sdfsdjkhfjksh");
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

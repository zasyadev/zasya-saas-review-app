import React, { useState } from "react";
import { Modal, Form, Input, Button, Col, Row, Upload } from "antd";
import Image from "next/image";
import User from "../../assets/images/User.png";
import { Avatar } from "@material-ui/core";
import { UserOutlined } from "@ant-design/icons";
function Profile({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formMode, setFormMode] = useState({
    isEdit: false,
  });

  const handleToggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const handleEdit = () => {
    setFormMode({ isEdit: true });
    form.resetFields();
    handleToggleModal();
  };

  const handleShowModal = () => {
    handleToggleModal();
    if (formMode.isEdit) {
      setFormMode({
        isEdit: false,
      });
    }

    form.resetFields();
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  return (
    <div>
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
                        onClick={handleShowModal}
                      >
                        Change Setting
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Row className="mx-6">
                <Col lg={8} className="flex  items-center justify-center">
                  <Image src={User} alt="user" width={120} height={120} />
                  {/* <div className="flex flex-wrap items-center mb-3">
              {user.profile_img ? (
                <Avatar
                  className="mb-2  mr-5"
                  size={avatarSize}
                  src={`${Config.SERVER_BASE_URL}${user.profile_img}`}
                />
              ) : (
                <Avatar
                  className="mb-2 mr-5"
                  size={avatarSize}
                  icon={<UserOutlined />}
                />
              )}

              <div className="img-upload mb-2">
                <p className="font-medium mb-0">Upload your avatar</p>

                <p className="text-xs text-gray-400 mb-2">
                  Photo should be at least 300px X 300px
                </p>

                <Upload
                  name="image"
                  showUploadList={false}
                  action={uploadActionUrl}
                  data={{ category: "profile" }}
                  onChange={handleChange}
                >
                  <Button
                    loading={imgLoading}
                    disabled={imgLoading}
                    shape="round"
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
                   <Image src={User} alt="user" width={120} height={120} />
                  <div>Email: {}</div> */}
                </Col>

                <Col lg={15} className="mt-4">
                  <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
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
                      {/* <Col md={12} sm={24} xs={24}>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input placeholder="Email" value={user.email} />
                        </Form.Item>
                      </Col> */}
                    </Row>

                    <div className="text-center">
                      <Button
                        className="text-center rounded-full border-2 ml-3 px-4 bg-purple-500 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                        htmlType="submit"
                      >
                        Save
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
        title={formMode.isEdit ? "Update" : "Change Password"}
        visible={isModalVisible}
        onOk={handleToggleModal}
        onCancel={handleToggleModal}
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
              {formMode.isEdit ? "Update" : "Change Password"}
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
            {formMode.isEdit && (
              <>
                <div className="flex">
                  <div className="mx-2">
                    <Form.Item
                      label="First Name"
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: "First name",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                        placeholder="first name"
                      />
                    </Form.Item>
                  </div>
                  <div className="mx-2">
                    <Form.Item
                      label="Last Name"
                      name="last_name"
                      rules={[
                        {
                          required: true,
                          message: "Last name",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                        placeholder="Last Name"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="mx-2  ">
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "email",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                      // placeholder="@gmail.com"
                    />
                  </Form.Item>
                </div>
              </>
            )}

            {!formMode.isEdit && (
              <>
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
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
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
              </>
            )}
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;

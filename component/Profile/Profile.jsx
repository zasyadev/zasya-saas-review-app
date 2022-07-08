import React, { useState } from "react";
import { Modal, Form, Input, Button, Col, Row, Upload, message } from "antd";
import { useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";

// const otherprops = {
//   name: "file",

//   headers: {
//     authorization: "authorization-text",
//   },

//   onChange(info) {
//     if (info.file.status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }

//     if (info.file.status === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
// };
function Profile({ user }) {
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [userimageSrc, setuserImageSrc] = useState(false);
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

  // const handleEdit = () => {
  //   setFormMode({ isEdit: true });
  //   passwordForm.resetFields();
  //   handleToggleModal();
  // };

  // const handleShowModal = () => {
  //   handleToggleModal();
  //   if (formMode.isEdit) {
  //     setFormMode({
  //       isEdit: false,
  //     });
  //   }

  //   passwordForm.resetFields();
  // };

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
              <Row justify="center">
                <Col lg={12} className="mt-4 items-center">
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                  >
                    <Row gutter={16}>
                      <Col md={24} sm={24} xs={24}>
                        <Form.Item
                          label="First Name"
                          name="first_name"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            placeholder="First Name"
                            className="bg-gray-100 h-12 rounded-md"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={24} sm={24} xs={24}>
                        <Form.Item
                          label="Last Name"
                          name="last_name"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            placeholder="Last Name"
                            className="bg-gray-100 h-12 rounded-md"
                          />
                        </Form.Item>{" "}
                      </Col>
                      <Col md={24} sm={24} xs={24}>
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
                            className="bg-gray-100 h-12 rounded-md"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="text-center">
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

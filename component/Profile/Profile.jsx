import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

function Profile({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const onFinish = (values) => {
    console.log(values);
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
                  <div className="w-full flex items-center justify-between">
                    <h2 className="text-white text-2xl">Details</h2>
                    <span
                      className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                      onClick={() => showModal(false)}
                    >
                      Change Setting
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-gray-900 text-2xl font-serif font-bold leading-normal mt-0 mb-2">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="mt-0 mb-2 text-gray-700 flex items-center justify-center gap-2">
                  <span className="material-icons  text-xl leading-none">
                    Company Name
                  </span>
                  {user.company_name}
                </div>
                <div className="mb-2 text-gray-700 mt-10 flex items-center justify-center gap-2">
                  <span className="material-icons  text-xl leading-none">
                    Email
                  </span>
                  {user.email}
                </div>
              </div>
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
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <div>
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
          </div>,
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
            <div className="mb-6">
              <Form.Item
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
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                  placeholder="Old Password"
                />
              </Form.Item>
            </div>
            <div className="mb-6">
              <Form.Item
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
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                  placeholder="New Password"
                />
              </Form.Item>
            </div>
            <div className="mb-6">
              <Form.Item
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
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                  placeholder="Confirm Password"
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;

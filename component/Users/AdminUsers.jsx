import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Radio,
  Row,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";

const { Content } = Layout;

function AdminUsers({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [upadteData, setUpdateData] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  async function onFinish(values) {
    let obj = {
      ...values,
      role: 3,
    };
    editMode ? updateUserData(obj) : createUserData(obj);
  }

  async function createUserData(obj) {
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(obj),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          message.success(response.message, 3);
          fetchUserData();
          form.resetFields();
          setIsModalVisible(false);
        } else {
          message.error(response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }
  async function updateUserData(obj) {
    if (upadteData.id) {
      obj.id = upadteData.id;
      await fetch("/api/user/adminuser", {
        method: "PUT",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            setEditMode(false);
            fetchUserData();
            form.resetFields();
            setIsModalVisible(false);
            message.success(response.message, 3);
          } else {
            message.error(response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }
  async function deleteGroup(data) {
    if (data.id) {
      await fetch("/api/user/adminuser", {
        method: "DELETE",
        body: JSON.stringify(data),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            fetchUserData();
            message.success(response.message, 3);
          } else {
            message.error(response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  async function fetchUserData() {
    setLoading(true);
    setUserList([]);
    await fetch("/api/user/adminuser", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setUserList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
       
        setUserList([]);
      });
  }

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  async function onUpdate(item) {
    setEditMode(true);
    setUpdateData(item);
    setIsModalVisible(true);
    form.setFieldsValue({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      company_name: item.company_name,
      // password: await hashedPassword(item.password),
      status: item.status,
    });
  }
  const onCancel = () => {
    setIsModalVisible(false);
    setEditMode(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="h-screen">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />

        <div className="px-3 md:px-8 h-auto -mt-24">
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 px-4 mb-16">
              <div className="w-full bg-white rounded-md overflow-hdden shadow-md p-4 ">
                <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-md text-white  items-center w-full h-40 sm:h-24 py-4 px-8 justify-between shadow-lg-purple ">
                  <h2 className="text-white text-2xl font-bold">Users List </h2>
                  <span
                    className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                    onClick={showModal}
                  >
                    Create
                  </span>
                </div>
                <div className="p-4 ">
                  <div className="overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                      <thead>
                        <tr>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Name
                          </th>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Email
                          </th>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Role
                          </th>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Status
                          </th>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <th colSpan={4}>
                              <Skeleton
                                title={false}
                                active={true}
                                width={[200]}
                                className="mt-4"
                                rows={3}
                              />
                            </th>
                          </tr>
                        ) : userList.length > 0 ? (
                          userList.map((item, idx) => {
                            return (
                              <tr key={idx + "user"}>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.first_name} {item.last_name}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.email}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.role_id}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.status ? "Active" : "InActive"}
                                </th>
                                <th className="border-b underline border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left cursor-pointer">
                                  <p>
                                    <span
                                      className="text-yellow-500 text-lg mx-2"
                                      onClick={() => onUpdate(item)}
                                    >
                                      <EditOutlined />
                                    </span>
                                    <span
                                      className="text-red-500 text-lg mx-2"
                                      onClick={() => deleteGroup(item)}
                                    >
                                      <DeleteOutlined />
                                    </span>
                                  </p>
                                </th>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <th
                              colSpan={3}
                              className="border-b text-center border-gray-200 align-middle font-semibold text-sm whitespace-nowrap px-2 py-4 "
                            >
                              No Users Found
                            </th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={`${editMode ? "Update" : "Add"}  Users`}
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => onCancel()}
        footer={[
          <div>
            <Button key="add" type="default" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button key="add" type="primary" onClick={form.submit}>
              {editMode ? "Update" : "Add"}
            </Button>
          </div>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={16}>
            <Col md={12} xs={24}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            {!editMode && (
              <Col md={12} xs={24}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            )}

            <Col md={12} xs={24}>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={1}>Active</Radio>
                  <Radio value={0}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AdminUsers;

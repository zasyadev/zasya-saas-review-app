import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Switch,
  Skeleton,
} from "antd";

const { Content } = Layout;

function Team({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupsList, setGroupsList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [upadteData, setUpdateData] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  async function onFinish(values) {
    let obj = {
      name: values.name,
      category: values.category,
      status: values.status,
      user_id: user.id,
    };
    await fetch("/api/team/groups", {
      method: "POST",
      body: JSON.stringify(obj),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
        }
      })
      .catch((err) => console.log(err));
  }

  async function fetchGroupsData() {
    setLoading(true);
    setGroupsList([]);
    await fetch("/api/team/groups", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setGroupsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setGroupsList([]);
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
  const onUpdate = (group) => {
    setEditMode(true);
    setUpdateData(group);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: group.name,
      category: group.category,
      status: group.status,
    });
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

  return (
    <Content className="h-screen">
      <div>
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />

        <div className="px-3 md:px-8 h-auto -mt-24">
          <div className="container mx-auto max-w-full">
            <div className="grid grid-cols-1 px-4 mb-16">
              <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 undefined">
                <div className="flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-24 py-4 px-8 justify-between shadow-lg-purple undefined">
                  <h2 className="text-white text-2xl font-bold">
                    Team Groups{" "}
                  </h2>
                  <span
                    className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer"
                    onClick={showModal}
                  >
                    Create
                  </span>
                </div>
                <div className="p-4 undefined">
                  <div className="overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                      <thead>
                        <tr>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Group Name
                          </th>
                          <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                            Category
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
                          <Skeleton />
                        ) : groupsList.length > 0 ? (
                          groupsList.map((item, idx) => {
                            return (
                              <tr key={idx + "group"}>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.name}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.category}
                                </th>
                                <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  {item.status ? "Active" : "InActive"}
                                </th>
                                <th className="border-b underline border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                  <p onClick={() => onUpdate(item)}>Edit</p>
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
                              No Groups Found
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
        title={`${editMode ? "Update" : "Add"}  Team Group`}
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditMode(false);
          form.resetFields();
        }}
        footer={[
          <div>
            <Button key="add" type="default">
              Cancel
            </Button>
            <Button key="add" type="primary">
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
                name="name"
                label="Name"
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
                name="category"
                label="Category"
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
                name="status"
                label="Status"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Content>
  );
}

export default Team;

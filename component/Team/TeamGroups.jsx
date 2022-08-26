import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Radio,
  Skeleton,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
    editMode ? updatingGroup(obj) : addingGroup(obj);
  }

  async function addingGroup(obj) {
    await fetch("/api/team/groups", {
      method: "POST",
      body: JSON.stringify(obj),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          form.resetFields();
          fetchGroupsData();
          setIsModalVisible(false);
          message.success(response.message, 3);
        } else {
          message.error(response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }
  async function updatingGroup(obj) {
    if (upadteData.id) {
      obj.id = upadteData.id;
      await fetch("/api/team/groups", {
        method: "PUT",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            form.resetFields();
            fetchGroupsData();
            setIsModalVisible(false);
            setEditMode(false);
            message.success(response.message, 3);
          } else {
            message.error(response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }
  async function deleteGroup(id) {
    if (id) {
      let obj = {
        id: id,
      };
      await fetch("/api/team/groups", {
        method: "DELETE",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            fetchGroupsData();
            message.success(response.message, 3);
          } else {
            message.error(response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
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
  const onCancel = () => {
    setIsModalVisible(false);
    setEditMode(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />
      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
              <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-8 justify-between shadow-lg-purple ">
                <h2 className="text-white text-2xl font-bold">Team Groups </h2>
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
                                    onClick={() => deleteGroup(item.id)}
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
                            colSpan={6}
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

      <Modal
        title={`${editMode ? "Update" : "Add"}  Team Group`}
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => onCancel()}
        footer={[
          <>
            <Button key="add" type="default" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button key="add" type="primary" onClick={form.submit}>
              {editMode ? "Update" : "Add"}
            </Button>
          </>,
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
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default Team;

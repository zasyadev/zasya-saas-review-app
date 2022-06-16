import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Modal,
  Form,
  Row,
  Col,
  Radio,
  Skeleton,
  Select,
  Input,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../helpers/notification";
import { Table } from "antd";

function TeamMembers({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [upadteData, setUpdateData] = useState({});
  // const [groupsList, setGroupsList] = useState([]);
  // const [userList, setUserList] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  async function onFinish(values) {
    let obj = {
      ...values,
      organization_id: user.organization_id,
      role: 4,
    };

    // console.log(obj, "obj ");
    // return;

    editMode ? updatingGroup(obj) : addingGroup(obj);
  }

  async function addingGroup(obj) {
    await fetch("/api/team/members", {
      method: "POST",
      body: JSON.stringify(obj),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          fetchMembersData();
          form.resetFields();
          setIsModalVisible(false);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }
  async function updatingGroup(obj) {
    if (upadteData.id) {
      obj.id = upadteData.id;
      await fetch("/api/team/members", {
        method: "PUT",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            fetchMembersData();
            form.resetFields();
            setIsModalVisible(false);
            setEditMode(false);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }
  async function onDelete(id) {
    if (id) {
      let obj = {
        id: id,
      };
      await fetch("/api/team/members", {
        method: "DELETE",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            fetchMembersData();
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  async function fetchMembersData() {
    setLoading(true);
    setMembersList([]);
    await fetch("/api/team/" + user.organization_id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          // setMembersList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setMembersList([]);
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
  const onUpdate = (data) => {
    setEditMode(true);
    setUpdateData(data);
    setIsModalVisible(true);
    form.setFieldsValue({
      employee_id: data.user_id,
      tags: data.tags,
    });
  };
  const onCancel = () => {
    setIsModalVisible(false);
    setEditMode(false);
    form.resetFields();
  };
  // async function fetchGroupData() {
  //   // setLoading(true);
  //   setGroupsList([]);
  //   await fetch("/api/team/groups", {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response.status === 200) {
  //         let data = response.data.filter((item) => item.status);
  //         setGroupsList(data);
  //       }
  //       // setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setGroupsList([]);
  //     });
  // }
  // async function fetchUserData() {
  //   // setLoading(true);
  //   setUserList([]);
  //   await fetch("/api/user/adminuser", {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response.status === 200) {
  //         let data = response.data.filter((item) => item.status);
  //         setUserList(data);
  //       }
  //       // setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setUserList([]);
  //     });
  // }

  useEffect(() => {
    fetchMembersData();
    // fetchGroupData();
    // fetchUserData();
  }, []);

  const columns = [
    {
      title: "Member Name",
      dataIndex: "user",
      render: (user) => user.first_name + " " + user.last_name,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (tags) =>
        tags.map((item) => {
          return (
            <>
              <span className="mx-2">{item}</span>
            </>
          );
        }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          <span
            className="text-yellow-500 text-lg mx-2"
            onClick={() => onUpdate(record)}
          >
            <EditOutlined />
          </span>
          <span
            className="text-red-500 text-lg mx-2"
            onClick={() => onDelete(record.id)}
          >
            <DeleteOutlined />
          </span>
        </p>
      ),
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
              <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-6 md:px-8 justify-between shadow-lg-purple ">
                <h2 className="text-white text-2xl font-bold ">
                  Team Members{" "}
                </h2>
                <span
                  className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                  onClick={showModal}
                >
                  Create
                </span>
              </div>
              <div className="p-4 ">
                <div className="overflow-x-auto">
                  {
                    loading ? (
                      <Skeleton
                        title={false}
                        active={true}
                        width={[200]}
                        className="mt-4"
                        rows={3}
                      />
                    ) : (
                      <Table
                        dataSource={membersList}
                        columns={columns}
                        className="custom-table"
                        pagination={false}
                      />
                    )
                    /* <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Group Name
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Member Name
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Tags
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
                      ) : membersList.length > 0 ? (
                        membersList.map((item, idx) => {
                          return (
                            <tr key={idx + "group"}>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item?.user?.first_name}
                              </th>

                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.tags.length > 0
                                  ? item.tags.map((tag, i) => {
                                      return (
                                        <span
                                          key={i + idx + "tag"}
                                          className="mx-2"
                                        >
                                          {tag}
                                        </span>
                                      );
                                    })
                                  : "No Tags Added"}
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
                            colSpan={4}
                            className="border-b text-center border-gray-200 align-middle font-semibold text-sm whitespace-nowrap px-2 py-4 "
                          >
                            No Members Found
                          </th>
                        </tr>
                      )}
                    </tbody>
                  </table> */
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={`${editMode ? "Update" : "Add"}  Team Members`}
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
            {/* <Col md={12} xs={24}>
              <Form.Item
                name="group_id"
                label="Group Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select Groups"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {groupsList.map((data, index) => (
                    <Select.Option key={index} value={data.id}>
                      {data.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}

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
            {/* <Col md={12} xs={24}>
              <Form.Item
                name="employee_id"
                label="Members Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select Groups"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {userList.map((data, index) => (
                    <Select.Option key={index} value={data.id}>
                      {data.first_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}
            <Col md={12} xs={24}>
              <Form.Item
                name="tags"
                label="Tags Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select mode="tags" placeholder="Tags">
                  <Select.Option key={"developer"} value={"Developer"}>
                    Developer
                  </Select.Option>
                  <Select.Option key={"QA"} value={"QA"}>
                    QA
                  </Select.Option>
                  <Select.Option key={"Testing"} value={"Testing"}>
                    Testing
                  </Select.Option>
                </Select>
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
                  <Radio value={1}>Active</Radio>
                  <Radio value={0}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {/* <Col md={12} xs={24}>
              <Form.Item
                name="is_manager"
                label="Is Manager"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default TeamMembers;

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
import CustomTable from "../../helpers/CustomTable";
// import SiderRight from "../SiderRight/SiderRight";

function TeamMembers({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [upadteData, setUpdateData] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  async function onFinish(values) {
    let obj = {
      ...values,
      organization_id: user.organization_id,
      role: 4,
      status: 1,
    };

    editMode ? updatingMember(obj) : addingMember(obj);
  }

  async function addingMember(obj) {
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
  async function updatingMember(obj) {
    if (upadteData.id) {
      (obj.tag_id = upadteData?.UserTags?.id), 0;
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
  async function onDelete(email) {
    if (email) {
      await fetch("/api/team/members", {
        method: "DELETE",
        body: JSON.stringify({
          email: email,
        }),
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
          setMembersList(response.data);
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
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      tags: data.UserTags.tags,
      status: data.status,
    });
  };
  const onCancel = () => {
    setIsModalVisible(false);
    setEditMode(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchMembersData();
  }, []);

  const columns = [
    {
      title: "Name",
      render: (_, record) => record.first_name + " " + record.last_name,
    },
    {
      title: "Email",
      render: (_, record) => record.email,
    },
    {
      title: "Tags",

      render: (_, record) =>
        record?.UserTags?.tags?.length > 0
          ? record?.UserTags?.tags.map((item, index) => (
              <span className="mx-2" key={index + "tags"}>
                {item}
              </span>
            ))
          : null,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          <span
            className="primary-color-blue text-xl mx-2 cursor-pointer "
            onClick={() => onUpdate(record)}
          >
            <EditOutlined />
          </span>
          <button
            className="primary-color-blue text-xl mx-2 cursor-pointer"
            onClick={() => onDelete(record.email)}
          >
            <DeleteOutlined />
          </button>
        </p>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col sm={24} md={24}>
          <div className="px-3 md:px-8 h-auto mt-5">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 px-4 mb-16">
                {/* <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-6 md:px-8 justify-between shadow-lg-purple ">
              <h2 className="text-white text-2xl font-bold ">Team Members </h2>
              <span
                className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                onClick={showModal}
              >
                Create
              </span>
            </div> */}

                <div className="flex justify-end">
                  <div className="my-2 ">
                    <button
                      className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                      onClick={showModal}
                    >
                      Create Team
                    </button>
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                  <div className="p-4 ">
                    <div className="overflow-x-auto">
                      {loading ? (
                        <Skeleton
                          title={false}
                          active={true}
                          width={[200]}
                          className="mt-4"
                          rows={3}
                        />
                      ) : (
                        <CustomTable
                          dataSource={membersList}
                          columns={columns}
                          className="custom-table"
                          pagination={false}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        {/* <Col sm={24} md={24} lg={7} className="mt-6 ">
          <SiderRight />
        </Col> */}
      </Row>
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
            <Col md={12} xs={24} lg={24}>
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
            <Col md={12} xs={24} lg={24}>
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

            <Col md={12} xs={24} lg={24}>
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
                <Input disabled={editMode} />
              </Form.Item>
            </Col>

            <Col md={12} xs={24} lg={24}>
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
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default TeamMembers;

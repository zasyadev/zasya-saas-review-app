import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col, Skeleton, Select, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../helpers/notification";
import FormView from "../Form/FormView";
import CustomTable from "../../helpers/CustomTable";
import { ReviewAssigneeList } from "./ReviewAssigneelist";

function ReviewManagement({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [formList, setFormList] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [reviewAssignList, setReviewAssignList] = useState([]);
  const [reviewAssign, setReviewAssign] = useState(false);
  const [reviewAssignee, setReviewAssignee] = useState(false);
  const [reviewAssigneeData, setReviewAssigneeData] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsModalVisible(false);
    setEditMode(false);
    form.resetFields();
  };

  async function onFinish(values) {
    let obj = {
      created_by: user.id,
      assigned_to_id: [values.assigned_to_id],
      template_id: values.template_id,
      review_type: values.review_type,
      review_name: values.review_name,
      status: values.status,
      frequency: values.frequency,
      role_id: user.role_id,
      organization_id: user.organization_id,
    };
    editMode ? updateReviewAssign(obj) : addReviewAssign(obj);
  }

  async function addReviewAssign(obj) {
    await fetch("/api/review/manage", {
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
          fetchReviewAssignList();
          form.resetFields();
          setIsModalVisible(false);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }
  async function updateReviewAssign(obj) {
    if (updateData.id) {
      obj.id = updateData.id;
      await fetch("/api/review/manage", {
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
            fetchReviewAssignList();
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

  async function fetchReviewAssignList() {
    setLoading(true);
    setReviewAssignList([]);

    await fetch("/api/review/" + user.id, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setReviewAssignList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchUserData() {
    setUserList([]);
    await fetch("/api/user/adminuser", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter((item) => item.status);
          setUserList(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setUserList([]);
      });
  }
  async function fetchTemplateData() {
    setFormList([]);
    await fetch("/api/template/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter((item) => item.status);
          setFormList(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setFormList([]);
      });
  }

  const onUpdate = (data) => {
    setEditMode(true);
    setUpdateData(data);
    setIsModalVisible(true);
    form.setFieldsValue({
      assigned_to_id: data.assigned_to_id,
      template_id: data.template_id,
      status: data.status,
      review_type: data.review_type,
      frequency: data.frequency,
    });
  };

  async function onDelete(id) {
    if (id) {
      let obj = {
        id: id,
      };
      await fetch("/api/review/manage", {
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
            fetchReviewAssignList();
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    fetchReviewAssignList();
    fetchUserData();
    fetchTemplateData();
  }, []);

  const validateMessages = {
    required: "${label} is required!",
  };

  const columns = [
    // {
    //   title: "Assign By",
    //   dataIndex: "created",
    //   render: (created) =>
    //     created.first_name + " " + created.last_name,
    // },
    // {
    //   title: "Assign To",
    //   dataIndex: "assigned_to",
    //   render: (assigned_to) =>
    //     assigned_to.first_name + " " + assigned_to.last_name,
    // },
    {
      title: "Review Name",

      render: (_, record) => (
        <p
          onClick={() => {
            setReviewAssignee(true);
            setReviewAssigneeData(record);
          }}
          className="cursor-pointer underline"
        >
          {record.review_name}
        </p>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
    },
    {
      title: "Type",
      dataIndex: "review_type",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          {/* <span
            className="text-yellow-500 text-lg mx-2"
            onClick={() => onUpdate(record)}
          >
            <EditOutlined />
          </span> */}
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

  return reviewAssign ? (
    <FormView
      user={user}
      setReviewAssign={setReviewAssign}
      reviewAssign={reviewAssign}
    />
  ) : (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          {reviewAssignee ? (
            <ReviewAssigneeList
              data={reviewAssigneeData}
              setReviewAssignee={setReviewAssignee}
              user={user}
            />
          ) : (
            <div className="grid grid-cols-1 px-4 mb-16">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <button
                    className={`${
                      reviewAssign ? "bg-red-400" : "bg-indigo-800"
                    } " text-white text-sm py-3 text-center px-4 rounded-l-md `}
                    onClick={() => setReviewAssign(true)}
                  >
                    Review Recived
                  </button>
                  <button
                    className={`${
                      reviewAssign ? "bg-indigo-800" : "bg-red-400"
                    } " text-white text-sm py-3 text-center px-4 rounded-r-md `}
                    onClick={() => setReviewAssign(false)}
                  >
                    Review Created
                  </button>
                </div>
                <div>
                  <div className="flex items-end">
                    <button
                      className="bg-indigo-800 text-white text-sm py-3 text-center px-4 rounded-md"
                      onClick={showModal}
                    >
                      Create Review
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                <div className="">
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
                        dataSource={reviewAssignList}
                        columns={columns}
                        pagination={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title={`${editMode ? "Update Assigned " : "Assign"}  Reviews`}
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => onCancel()}
        footer={[
          <>
            <Button key="cancel" type="default" onClick={() => onCancel()}>
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
                name="review_name"
                label="Review Name"
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
                name="review_type"
                label="Review Type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="Select Type">
                  <Select.Option value="feedback">Feedback</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="assigned_to_id"
                label="Employee Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select Member"
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
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="template_id"
                label="Template"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select Template"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {formList.map((data, index) => (
                    <Select.Option key={index} value={data.id}>
                      {data.form_title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item
                name="frequency"
                label="Frequency"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="Select Frequency">
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="weekly">Weekly</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
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
                <Select placeholder="Select Status">
                  <Select.Option value="published">Published</Select.Option>
                  <Select.Option value="draft">Draft</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default ReviewManagement;

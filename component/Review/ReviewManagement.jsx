import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Skeleton,
  Select,
  Input,
  Radio,
  Checkbox,
} from "antd";
import { DeleteOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../helpers/notification";
import FormView from "../Form/FormView";
import CustomTable from "../../helpers/CustomTable";
import ReviewAssigneeList from "../Review/ReviewAssigneeList";

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
  const [memberDetails, setMemberDetails] = useState(true);
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

  function onFinish(values) {
    editMode
      ? updateReviewAssign(updateData, values)
      : addReviewAssign({
          created_by: user.id,
          assigned_to_id: [values.assigned_to_id],
          template_id: values.template_id,
          review_type: values.review_type,
          review_name: values.review_name,
          status: values.status ?? "pending",
          frequency: values.frequency,
          role_id: user.role_id,
          organization_id: user.organization_id,
          is_published: values.is_published ? "published" : "draft",
        });
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
      .catch((err) => fetchReviewAssignList([]));
  }
  async function updateReviewAssign(data, values) {
    if (data.id) {
      data.assigned_to_id = [values.assigned_to_id];
      data.review_assigned_by = user.id;
      data.is_published = "published";
      await fetch("/api/review/manage", {
        method: "PUT",
        body: JSON.stringify(data),
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
    await fetch("/api/user/oraganizationId/" + user.organization_id, {
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
        setFormList([]);
      });
  }

  const onUpdate = (data) => {
    setEditMode(true);
    setUpdateData(data);
    setIsModalVisible(true);
    // form.setFieldsValue({
    //   is_published: data.is_published,
    //   review_type: data.review_type,
    //   review_name: data.review_name,
    //   review_type: data.review_type,
    //   template_id: data.template_id,
    //   frequency: data.frequency,

    // });
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
        .catch((err) => fetchReviewAssignList([]));
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
    {
      title: "Review Name",
      key: "review_name",
      render: (_, record) => (
        <p
          onClick={() => {
            record.is_published === "published"
              ? setReviewAssignee(true)
              : null;
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
      key: "frequency ",
      dataIndex: "frequency",
      render: (frequency) => <p className={`capitalize `}>{frequency}</p>,
    },
    {
      title: "Type",
      key: "review_type ",
      dataIndex: "review_type",
      render: (review_type) => <p className={`capitalize `}>{review_type}</p>,
    },
    {
      title: "Status",
      key: "is_published ",
      dataIndex: "is_published",
      render: (is_published) => (
        <p
          className={`capitalize ${
            is_published != "published" ? "text-red-400" : "text-green-400"
          }`}
        >
          {is_published}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          {record.is_published != "published" && (
            <span
              className="primary-color-blue text-xl mx-2 cursor-pointer"
              onClick={() => onUpdate(record)}
              title="Assign"
            >
              <UserSwitchOutlined />
            </span>
          )}

          {record.created_by === user.id && (
            <span
              className="primary-color-blue text-lg mx-2 cursor-pointer"
              onClick={() => onDelete(record.id)}
              title="Delete"
            >
              <DeleteOutlined />
            </span>
          )}
        </p>
      ),
    },
  ];

  const onChangeStatus = (e) => {
    if (e.target.checked) {
      setMemberDetails(true);
    } else {
      setMemberDetails(false);
    }
  };

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
              <div className=" md:flex items-center justify-between mb-3  ">
                <div className="flex">
                  <button
                    className={`${
                      reviewAssign ? "toggle-btn-bg" : "primary-bg-btn"
                    } " text-white text-sm  py-3 text-center px-4 rounded-r-none rounded-l-md  md:w-fit mt-2 `}
                    onClick={() => setReviewAssign(true)}
                  >
                    Review Recived
                  </button>
                  <button
                    className={`${
                      reviewAssign ? "primary-bg-btn" : "toggle-btn-bg"
                    } " text-white text-sm py-3 text-center px-4  rounded-l-none rounded-r-md    md:w-fit mt-2`}
                    onClick={() => setReviewAssign(false)}
                  >
                    Review Created
                  </button>
                </div>
                <div>
                  <div className="md:flex items-end mt-2 ">
                    <button
                      className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md w-full "
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
                        rowKey="review_id"
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
        title={`${editMode ? "Update " : "Assign"}  Review`}
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
          {editMode ? (
            <Row gutter={16}>
              <Col md={24} xs={24}>
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
                      <Select.Option key={index + "user"} value={data.id}>
                        {data.first_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="is_published"
                  // label="Status"
                  // rules={[
                  //   {
                  //     required: true,
                  //   },
                  // ]}
                  valuePropName="checked"
                >
                  <Checkbox onChange={onChangeStatus}>
                    {" "}
                    Publish This Review
                  </Checkbox>
                  {/* <Radio.Group
                    placeholder="Select Status"
                    onChange={onChangeStatus}
                  >
                    <Radio value="published">Published</Radio>
                    <Radio value="draft">Draft</Radio>
                  </Radio.Group> */}
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
                  <Radio.Group placeholder="Select Type">
                    <Radio value="feedback">Feedback</Radio>
                    <Radio value="other">Other</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

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
              {memberDetails && (
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
                        <Select.Option key={index + "users"} value={data.id}>
                          {data.first_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}

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
                      <Select.Option key={index + "form"} value={data.id}>
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
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ReviewManagement;

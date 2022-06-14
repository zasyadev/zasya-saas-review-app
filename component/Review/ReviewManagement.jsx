import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col, Skeleton, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../helpers/notification";
import FormView from "../Form/FormView";

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
      assigned_by_id: user.id,
      assigned_to_id: values.assigned_to_id,
      template_id: values.template_id,
      review_type: values.review_type,
      // status: values.status,
      frequency: values.frequency,
    };
    editMode ? updateFormAssign(obj) : addFormAssign(obj);
  }

  async function addFormAssign(obj) {
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
  async function updateFormAssign(obj) {
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
    await fetch("/api/template", {
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

  const onViewReviwed = () => {
    setReviewAssign(true);
  };

  return reviewAssign ? (
    <FormView user={user} setReviewAssign={setReviewAssign} />
  ) : (
    <div>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 md:px-8 h-40" />

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
              <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-8 justify-between shadow-lg-purple ">
                <h2 className="text-white text-2xl font-bold">
                  Review Assign{" "}
                </h2>
                <div>
                  <span
                    className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 mr-2"
                    onClick={() => onViewReviwed()}
                  >
                    View
                  </span>
                  <span
                    className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                    onClick={showModal}
                  >
                    Create
                  </span>
                </div>
              </div>
              <div className="p-4 ">
                <div className="overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Assign By
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Assign To
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Template Title
                        </th>
                        <th className="px-2 text-purple-500 align-middle border-b border-solid border-gray-200 py-3 text-sm whitespace-nowrap font-semibold text-left">
                          Frequency
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
                          <th colSpan={6}>
                            <Skeleton
                              title={false}
                              active={true}
                              width={[200]}
                              className="mt-4"
                              rows={3}
                            />
                          </th>
                        </tr>
                      ) : reviewAssignList.length > 0 ? (
                        reviewAssignList.map((item, idx) => {
                          return (
                            <tr key={idx + "user"}>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.assigned_by.first_name}{" "}
                                {item.assigned_by.last_name}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.assigned_to.first_name}{" "}
                                {item.assigned_to.last_name}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.form.form_title}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.frequency}
                              </th>
                              <th className="border-b border-gray-200 align-middle font-normal text-sm whitespace-nowrap px-2 py-4 text-left">
                                {item.status}
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
                                    onClick={() => onDelete(item.id)}
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
                            No Data Found
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
        title={`${editMode ? "Update Assigned " : "Assign"}  Reviews`}
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
                name="review_type"
                label="Review Type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select Type"
                  // showSearch
                  // filterOption={(input, option) =>
                  //   option.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
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

            {/* <Col md={12} xs={24}>
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
            </Col> */}
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default ReviewManagement;

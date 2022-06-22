import { Button, Col, Form, Modal, Row, Select, Table, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CustomTable from "../../helpers/CustomTable";

function Applaud({ user, dataSource }) {
  const [applaudform] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [applaudList, setApplaudList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updateData, setUpdateData] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsModalVisible(false);
    applaudform.resetFields();
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  async function fetchMember() {
    await fetch("/api/team/" + user.organization_id, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setMembersList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setMembersList([]);
      });
  }
  async function fetchApplaud() {
    await fetch("/api/applaud", { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        setApplaudList(res.data);
      })
      .catch((err) => {
        console.log(err);
        setApplaudList([]);
      });
  }

  async function addApplaud(obj) {
    await fetch("/api/applaud", {
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          applaudform.resetFields();
          setIsModalVisible(false);
          fetchApplaud();
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }

  async function updateApplaud(obj) {
    if (updateData.id) {
      obj.id = updateData.id;
    }
    await fetch("/api/applaud", {
      method: "PUT",
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          fetchApplaud();
          applaudform.resetFields();
          setIsModalVisible(false);
          setEditMode(false);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }

  const onFinish = (values) => {
    let obj = {
      user_id: values.user_id,
      comment: values.comment,
    };
    editMode ? updateApplaud(obj) : addApplaud(obj);
  };

  async function onDelete(id) {
    if (id) {
      let obj = {
        id: id,
      };
      await fetch("/api/applaud", {
        method: "DELETE",
        body: JSON.stringify(obj),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            openNotificationBox("success", res.message, 3);
            fetchApplaud();
          } else {
            openNotificationBox("error", res.message, 3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const onUpdate = (data) => {
    setEditMode(true);
    setUpdateData(data);
    setIsModalVisible(true);
    applaudform.setFieldsValue({
      user_id: data.user_id,
      comment: data.comment,
    });
  };

  useEffect(() => {
    fetchMember();
    fetchApplaud();
  }, []);

  const columns = [
    {
      title: "Name",
      render: (_, record) => record.user.first_name,
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center ">
          <button
            className="text-white text-base bg-indigo-800 text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
            onClick={() => onUpdate(record)}
          >
            <EditOutlined />
          </button>
          <button
            className="text-white text-base bg-indigo-800 text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
            onClick={() => onDelete(record.id)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {" "}
      <div className="px-3 md:px-8 h-auto ">
        <div className=" px-3 md:px-8 my-6" />
        <div className="container mx-auto max-w-full ">
          <div className="grid grid-cols-1 px-4 mb-16">
            {/* <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-4 md:px-8 justify-between shadow-lg-purple ">
              <h2 className="text-white text-2xl font-bold md:text-3xl">
                Applaud{" "}
              </h2>
              <div>
                <span
                  className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                  onClick={showModal}
                >
                  Create
                </span>
              </div>
            </div> */}
            <div className="flex justify-end">
              <div className="my-4 ">
                <button
                  className="bg-indigo-800 text-white text-sm py-3 text-center px-4 rounded-md"
                  onClick={showModal}
                >
                  Create Review
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
                      dataSource={applaudList}
                      columns={columns}
                      pagination={false}
                      className="custom-table"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title={editMode ? "Update" : "Create Applaud"}
          visible={isModalVisible}
          onOk={applaudform.submit}
          onCancel={() => onCancel()}
          footer={[
            <>
              <Button key="cancel" type="default" onClick={() => onCancel()}>
                Cancel
              </Button>
              <Button key="add" type="primary" onClick={applaudform.submit}>
                {editMode ? "Update" : "Add"}
              </Button>
            </>,
          ]}
        >
          <Form
            layout="vertical"
            form={applaudform}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={16}>
              <Col md={24} xs={24}>
                <Form.Item
                  name="user_id"
                  label="Member Name"
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
                    {membersList.map((data, index) => (
                      <Select.Option key={index} value={data.id}>
                        {data.first_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={24} xs={24}>
                <Form.Item
                  name="comment"
                  label="Comment"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Applaud;

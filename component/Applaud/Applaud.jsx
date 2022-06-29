import { Button, Col, Form, Modal, Row, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CustomTable from "../../helpers/CustomTable";
import moment from "moment";

function Applaud({ user }) {
  const [applaudform] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [applaudList, setApplaudList] = useState([]);
  const [receivedApplaudList, setReceivedApplaudList] = useState([]);
  const [receivedApplaudListVisible, setReceivedApplaudListVisible] =
    useState(false);
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
          let data = res.data.filter((item) => item.id != user.id);
          setMembersList(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setMembersList([]);
      });
  }
  async function fetchApplaud() {
    setLoading(true);
    await fetch("/api/applaud/" + user.id, { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        setApplaudList(res.data);
        setLoading(false);
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
      created_by: user.id,
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
    fetchReceivedApplaud();
  }, []);

  const fetchReceivedApplaud = async () => {
    setReceivedApplaudList([]);
    await fetch("/api/applaud/" + user.id, {
      method: "POST",
      body: JSON.stringify({
        user: user.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setReceivedApplaudList(res.data);
      })
      .catch((err) => {
        setReceivedApplaudList([]);
      });
  };

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
            className="text-white text-base primary-bg-btn text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
            onClick={() => onUpdate(record)}
          >
            <EditOutlined />
          </button>
          <button
            className="text-white text-base primary-bg-btn text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
            onClick={() => onDelete(record.id)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {receivedApplaudListVisible ? (
        <Row className="py-3 " justify="center">
          <Col sm={24} md={18} lg={18}>
            <div className="px-1  h-auto ">
              <div className="container mx-auto max-w-full ">
                <div className="grid grid-cols-1 px-2  mb-16">
                  <div className="flex justify-end ">
                    <button
                      className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                      onClick={() => setReceivedApplaudListVisible(false)}
                    >
                      Back
                    </button>
                  </div>
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md my-3">
                    <div className="p-4 ">
                      <div className="overflow-x-auto">
                        {receivedApplaudList.length > 0 ? (
                          receivedApplaudList.map((item, idx) => {
                            return (
                              <div
                                className="py-4  border-b-2"
                                key={"applaud" + idx}
                              >
                                <p className="mb-1">
                                  <span className="font-bold uppercase">
                                    {item.created.first_name}
                                  </span>{" "}
                                  has Applauded you on{" "}
                                  <span className="font-bold">
                                    {moment(item.created_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                  .
                                </p>
                                <p>
                                  {" "}
                                  <span className="font-bold">
                                    Comment :
                                  </span>{" "}
                                  {item.comment}
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <p>No Applauds received.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="py-3">
          <Col sm={24} md={24} lg={24}>
            <div className="px-1  h-auto ">
              <div className="container mx-auto max-w-full ">
                <div className="grid grid-cols-1 px-2  mb-16">
                  <div className="flex justify-between ">
                    <div className=" ">
                      <button
                        className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                        onClick={() => setReceivedApplaudListVisible(true)}
                      >
                        Received Applauds
                      </button>
                    </div>
                    <div className=" ">
                      <button
                        className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                        onClick={showModal}
                      >
                        Create Applaud
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-xl overflow-hdden shadow-md my-3">
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
            </div>
          </Col>
        </Row>
      )}

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
  );
}

export default Applaud;

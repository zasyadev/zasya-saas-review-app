import { Button, Col, Form, Modal, Row, Select, Skeleton } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
import CustomTable from "../../helpers/CustomTable";
import moment from "moment";
import { CalanderIcon, CommentIcons, UserIcon } from "../../assets/Icon/icons";

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
          applaudform.resetFields();
          setIsModalVisible(false);
          fetchApplaud();
          openNotificationBox("success", response.message, 3);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => fetchApplaud([]));
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
          applaudform.resetFields();
          fetchApplaud();
          setIsModalVisible(false);
          setEditMode(false);
          openNotificationBox("success", response.message, 3);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => fetchApplaud([]));
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
            fetchApplaud();
            openNotificationBox("success", res.message, 3);
          } else {
            openNotificationBox("error", res.message, 3);
          }
        })
        .catch((err) => {
          fetchApplaud([]);
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

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <div className="flex items-center ">
    //       <button
    //         className="text-white text-base primary-bg-btn text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
    //         onClick={() => onUpdate(record)}
    //       >
    //         <EditOutlined />
    //       </button>
    //       <button
    //         className="text-white text-base primary-bg-btn text-center px-3 rounded-md pb-2 mr-2  cursor-pointer"
    //         onClick={() => onDelete(record.id)}
    //       >
    //         <DeleteOutlined />
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="md:flex justify-end">
            <div className="my-3 mx-3 ">
              <button
                className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md w-full"
                onClick={showModal}
              >
                Create Applaud
              </button>
            </div>
          </div>

          <Row>
            <Col xs={24} md={12}>
              <div className="grid grid-cols-1 px-2 w-full">
                {/* <div className="flex justify-end ">
                  <button
                    className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                    onClick={() => setReceivedApplaudListVisible(false)}
                  >
                    Back
                  </button>
                </div> */}
                <div className=" bg-white rounded-xl overflow-hdden shadow-md my-3">
                  <div className="p-4 ">
                    <div className="overflow-x-auto">
                      <p className="font-semibold text-lg primary-color-blue">
                        Received Applaud
                      </p>
                      {receivedApplaudList.length > 0 ? (
                        receivedApplaudList.map((item, idx) => {
                          return (
                            <div
                              className=" border-2 rounded md:m-3 mt-2 shadow-md "
                              key={"applaud" + idx}
                            >
                              <Row className="m-5 px-2">
                                <Col xs={4} md={4}>
                                  <UserIcon className="primary-color-blue font-bold text-base " />
                                </Col>
                                <Col xs={20} md={20}>
                                  <p className="ml-2 text-base">
                                    <span className="uppercase ">
                                      {item.created.first_name}
                                    </span>{" "}
                                    has Applauded you on.
                                  </p>{" "}
                                </Col>
                              </Row>
                              <Row className="m-5 px-2">
                                <Col xs={4} md={4}>
                                  <CommentIcons className="primary-color-blue font-bold text-base" />
                                </Col>

                                <Col xs={20} md={20}>
                                  <p className="ml-2 break-all text-base">
                                    {item.comment}
                                  </p>
                                </Col>
                              </Row>
                              <Row className="m-5 px-2">
                                <Col xs={4} md={4}>
                                  <CalanderIcon className="primary-color-blue font-bold  text-base " />
                                </Col>
                                {/* <span className="font-bold"> */}
                                {/* Comment : */}
                                {/* </span>{" "} */}
                                <Col xs={20} md={20}>
                                  <p className=" ml-2 text-base">
                                    {moment(item.created_date).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center">No Applauds received.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="px-1  h-auto ">
                <div className="container mx-auto max-w-full ">
                  <div className="grid grid-cols-1 px-2  mb-16">
                    <div className="flex justify-end ">
                      {/* <div className=" ">
                    <button
                      className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md"
                      onClick={() => setReceivedApplaudListVisible(true)}
                    >
                      Received Applauds
                    </button>
                  </div> */}
                    </div>
                    <div className="w-full bg-white rounded-xl overflow-hdden shadow-md my-3">
                      <div className="p-4 ">
                        <div className="overflow-x-auto">
                          <p className="font-semibold text-lg primary-color-blue">
                            Applaud Given
                          </p>
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
      </div>
    </div>
  );
}

export default Applaud;

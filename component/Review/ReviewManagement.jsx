import React, { useState, useEffect } from "react";
import { Form, Skeleton, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../helpers/notification";
// import FormView from "../Form/FormView";
import CustomTable from "../../helpers/CustomTable";
// import ReviewAssigneeList from "../Review/ReviewAssigneeList";
import Link from "next/link";

function ReviewManagement({ user }) {
  const [loading, setLoading] = useState(false);

  const [reviewAssignList, setReviewAssignList] = useState([]);

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
            fetchReviewAssignList();
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => fetchReviewAssignList([]));
    }
  }

  useEffect(() => {
    fetchReviewAssignList();
  }, []);

  const answerAssignee = (data) => {
    if (data.length > 0) {
      let length = 0;
      let a = data.filter((item) => item.status);
      if (a.length) return a.length;
      else return length;
    }
  };

  const columns = [
    {
      title: "Review Name",
      key: "review_name",
      render: (_, record) => (
        <div className="flex">
          {/* onClick={() => { 
        //   record.is_published === "published"
        //     ? setReviewAssignee(true)
        //     : null;
        //   setReviewAssigneeData(record);
        // }}*/}

          <Link href={`/review/${record.id}`}>
            <p className="cursor-pointer underline text-gray-500">
              {record.review_name}
            </p>
          </Link>
        </div>
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
      title: "Count",
      key: "count ",

      render: (_, record) =>
        record.is_published != "published" ? (
          0
        ) : (
          <p>
            {answerAssignee(record.ReviewAssignee)}/
            {record.ReviewAssignee.length}
          </p>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          {record.is_published != "published" && (
            <Link href={`/review/edit/${record.id}`}>
              <span
                className="primary-color-blue text-xl mr-4 cursor-pointer"
                title="Assign"
              >
                <EditOutlined />
              </span>
            </Link>
          )}

          {record.created_by === user.id && (
            <>
              <Popconfirm
                title={`Are you sure to delete ${record.review_name} ？`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => onDelete(record.id)}
                icon={false}
              >
                <DeleteOutlined className="text-color-red text-xl" />
              </Popconfirm>
            </>
          )}
        </p>
      ),
    },
  ];

  return (
    <div>
      <div className="px-3 md:px-8 h-auto mt-5">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 px-4 mb-16">
            <div className=" md:flex items-center justify-between mb-3  ">
              <div className="flex w-auto">
                <Link href={"/review/received"}>
                  <button
                    className={`primary-bg-btn
                     text-white text-sm  py-3 text-center px-4 rounded-r-none rounded-l-md  w-1/2 md:w-fit mt-2 `}
                    // onClick={() => setReviewAssign(true)}
                  >
                    Received
                  </button>
                </Link>
                <button
                  className={`toggle-btn-bg
                  text-white text-sm py-3 text-center px-4  rounded-l-none rounded-r-md w-1/2 md:w-fit mt-2`}
                  // onClick={() => setReviewAssign(false)}
                >
                  Created
                </button>
              </div>
              <div>
                <Link href="/review/add">
                  <div className="md:flex items-end mt-2 ">
                    <button
                      className="primary-bg-btn text-white text-sm py-3 text-center px-4 rounded-md w-full "
                      // onClick={showModal}
                    >
                      Create
                    </button>
                  </div>
                </Link>
              </div>
            </div>

            <div className="w-full bg-white rounded-xl overflow-hdden shadow-md px-4 pb-4">
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
                      pagination={true}
                      rowKey="review_id"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
      {/* <Modal
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
                    <Select.Option value="once">Once</Select.Option>
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                    <Select.Option value="monthly">Monthly</Select.Option>
                  </Select>
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
                <Form.Item name="is_published" valuePropName="checked">
                  <Checkbox onChange={onChangeStatus}>
                    Publish This Review
                  </Checkbox>
                </Form.Item>
              </Col>

              {memberDetails && (
                <Col md={12} xs={24}>
                  <Form.Item
                    name="assigned_to_id"
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
                      {userList.map((data, index) => (
                        <Select.Option key={index + "users"} value={data.id}>
                          {data.first_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          )}
        </Form>
      </Modal> */}
    </div>
  );
}

export default ReviewManagement;

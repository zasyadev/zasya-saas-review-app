import React, { useEffect, useState } from "react";
import { Form, Row, Col, Select, Input, Radio, Checkbox, Button } from "antd";
import Link from "next/link";

import { useRouter } from "next/router";
import QuestionViewComponent from "../Form/QuestionViewComponent";
import ReviewViewComponent from "../Form/ReviewViewComponent";

function AddEditReviewComponent({ editMode, user }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [formList, setFormList] = useState([]);
  const [memberDetails, setMemberDetails] = useState(false);
  const [userList, setUserList] = useState([]);
  const [previewForm, setPreviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({});

  const validateMessages = {
    required: "${label} is required!",
  };

  function onFinish(values) {
    // editMode
    //   ? updateReviewAssign(updateData, values)
    //   :

    addReviewAssign({
      created_by: user.id,
      assigned_to_id: values.assigned_to_id,
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
          router.push("/review");
          openNotificationBox("success", response.message, 3);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
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

  const onChangeStatus = (e) => {
    if (e.target.checked) {
      setMemberDetails(true);
    } else {
      setMemberDetails(false);
    }
  };

  async function fetchUserData() {
    setUserList([]);
    await fetch("/api/user/oraganizationId/" + user.organization_id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter(
            (item) => item.status && item.id != user.id
          );
          setUserList(data);
        }
      })
      .catch((err) => {
        setUserList([]);
      });
  }
  console.log(formList, "formList");
  useEffect(() => {
    fetchTemplateData();
    fetchUserData();
  }, []);
  const handlePreviewForm = () => {
    let formData = form.getFieldsValue();

    let templateData = [];
    if (formData.template_id) {
      templateData = formList.filter((item) => item.id == formData.template_id);
    }
    setReviewFormData({ ...formData, templateData: templateData[0] });
    setPreviewForm(true);
  };

  return (
    <div className="w-full  md:w-4/6 mx-auto">
      <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4 template-wrapper">
        <div className="  rounded-t-md  mt-1">
          {previewForm ? (
            <div>
              {reviewFormData?.templateData?.form_data?.questions.length > 0 &&
                reviewFormData?.templateData?.form_data?.questions?.map(
                  (question, idx) => (
                    <>
                      <ReviewViewComponent {...question} idx={idx} />
                    </>
                  )
                )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-start  pt-2 pb-5 ">
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
                          label="Employee Name"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Select Member"
                            showSearch
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {userList.map((data, index) => (
                              <Select.Option
                                key={index + "users"}
                                value={data.id}
                              >
                                {data.first_name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    )}
                    <Col md={24} xs={24}>
                      <div className="flex justify-end">
                        <Link href="/review">
                          <Button key="cancel" type="default">
                            Cancel
                          </Button>
                        </Link>
                        <Button
                          key="preview"
                          type="default"
                          onClick={() => handlePreviewForm()}
                        >
                          Preview
                        </Button>
                        <Button key="add" type="default" htmlType="submit">
                          {editMode ? "Update" : "Add"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )}
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddEditReviewComponent;

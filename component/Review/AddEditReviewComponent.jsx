import React, { useEffect, useState } from "react";
import { Form, Row, Col, Select, Input, Radio } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../helpers/notification";
import ReviewViewComponent from "../Form/ReviewViewComponent";

const defaultScaleQuestion = {
  questionText: "Rating",
  options: [{ optionText: "low" }, { optionText: "high" }],
  lowerLabel: 1,
  higherLabel: 10,
  open: false,
  type: "scale",
};

function AddEditReviewComponent({ editMode, user }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [formList, setFormList] = useState([]);
  // const [memberDetails, setMemberDetails] = useState(false);
  const [userList, setUserList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [previewForm, setPreviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({});

  const validateMessages = {
    required: "${label} is required!",
  };

  function onFinish(values, type) {
    let templateData = {};
    if (type === "preview") {
      templateData = values.templateData;
    } else {
      templateData = formList.find((item) => item.id == values.template_id);
      if (values.review_type === "feedback")
        templateData?.form_data?.questions.push(defaultScaleQuestion);
    }

    addReviewAssign({
      created_by: user.id,
      assigned_to_id: values.assigned_to_id,
      template_id: values.template_id,
      review_type: values.review_type,
      review_name: values.review_name,
      status: values.status ?? "pending",
      frequency: values.frequency,
      role_id: user.role_id,
      // organization_id: user.organization_id,
      is_published: values.is_published,
      templateData: templateData,
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

  // const onChangeStatus = (e) => {
  //   if (e.target.checked) {
  //     setMemberDetails(true);
  //   } else {
  //     setMemberDetails(false);
  //   }
  // };

  async function fetchUserData() {
    setUserList([]);
    await fetch("/api/user/organizationId/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter(
            (item) => item.status == 1 && item.id != user.id
          );
          setUserList(data);
        }
      })
      .catch((err) => {
        setUserList([]);
      });
  }

  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    fetchTemplateData();
  }, [questionList]);

  function removeElement(idx) {
    setQuestionList((prev) => prev.filter((_, i) => i != idx));
  }

  const handlePreviewForm = () => {
    setReviewFormData({});
    setQuestionList([]);
    form.validateFields().then((data) => {
      let templateData = {};
      if (data.template_id) {
        templateData = formList.find((item) => item.id == data.template_id);

        if (data.review_type === "feedback") {
          templateData.form_data.questions.length > 0
            ? templateData.form_data.questions.push(defaultScaleQuestion)
            : null;
        }
        setQuestionList(templateData.form_data.questions);
        setReviewFormData({ ...data, templateData: templateData });
        setPreviewForm(true);
      } else {
        openNotificationBox("error", "Need to Select Template", 3);
      }
    });
  };
  const onPreviewSubmit = () => {
    let obj = {
      ...reviewFormData,
      templateData: {
        ...reviewFormData.templateData,
        form_data: {
          ...reviewFormData.templateData.form_data,
          questions: questionList,
        },
      },
    };
    onFinish(obj, "preview");
  };

  return (
    <>
      {previewForm ? (
        <>
          <div className="w-full  md:w-4/6 mx-auto">
            <div className="w-full rounded-xl  p-4 mt-4 template-wrapper flex flex-col">
              <div className="flex justify-between primary-bg-color px-4 py-4 rounded-t-md">
                <p className="text-white text-base font-medium">
                  Review Name : {reviewFormData.review_name}
                </p>
                <p className="text-white text-base font-medium">
                  Review Type : {reviewFormData.review_type}
                </p>
              </div>
              <div className="bg-white px-4 rounded-b-md">
                {questionList.length > 0 &&
                  questionList?.map((question, idx) => (
                    <>
                      <ReviewViewComponent
                        {...question}
                        idx={idx}
                        removeElement={removeElement}
                      />
                    </>
                  ))}
                <div>
                  <div className="flex justify-end my-5">
                    <button
                      key="cancel"
                      type="default"
                      onClick={() => {
                        setPreviewForm(false);
                        setReviewFormData({});
                        setQuestionList([]);
                      }}
                      className="py-3 h-full rounded toggle-btn-bg text-white lg:mx-4 w-1/4  my-1"
                    >
                      Cancel
                    </button>

                    <button
                      key="add"
                      type="default"
                      onClick={() => onPreviewSubmit()}
                      className=" px-4 py-3 h-full rounded primary-bg-btn text-white w-1/4 my-1"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full  md:w-4/6 mx-auto">
          <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4 add-template-wrapper">
            <div className="  rounded-t-md  mt-1">
              <div className=" w-full flex flex-col items-start  pt-2 pb-5 ">
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                  validateMessages={validateMessages}
                >
                  <Row gutter={16}>
                    <Col md={12} xs={24}>
                      <Form.Item
                        name="is_published"
                        label="Review Published For ? "
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Select placeholder="Select One">
                          <Select.Option value="published">
                            Yourself
                          </Select.Option>
                          <Select.Option value="draft">Others</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={12} xs={24}>
                      <Form.Item
                        name="review_name"
                        label="Enter Review Name"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col md={12} xs={24} className="full-width-label">
                      <Form.Item
                        name="template_id"
                        label={
                          <div className="w-full flex justify-between items-center ">
                            <p className="my-auto">Select Template</p>
                            <Link href="/template/add">
                              <p className="cursor-pointer text-xs my-auto">
                                Create
                              </p>
                            </Link>
                          </div>
                        }
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
                        label={
                          <div className="w-full flex justify-between items-center ">
                            <p className="my-auto">Select Frequency</p>
                          </div>
                        }
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

                    {/* {memberDetails && ( */}
                    <Col md={12} xs={24} className="full-width-label">
                      <Form.Item
                        className="select-tag"
                        name="assigned_to_id"
                        label={
                          <div className="w-full flex justify-between items-center">
                            <p className="my-auto">Select Member(s)</p>
                            {user?.role_id === 2 ? (
                              <Link href="/team/add">
                                <p className="cursor-pointer text-xs">Create</p>
                              </Link>
                            ) : null}
                          </div>
                        }
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
                              value={data?.user?.id}
                            >
                              {data?.user?.first_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={12} xs={24}>
                      <Form.Item
                        name="review_type"
                        label={
                          <div className="w-full flex justify-between items-center">
                            <p className="my-auto">Review Type</p>
                          </div>
                        }
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
                    {/* )} */}
                    <Col md={24} xs={24}>
                      <div className="flex justify-end">
                        <Link href="/review">
                          <button
                            key="cancel"
                            type="default"
                            className="primary-bg-btn text-white text-sm py-3 my-1  rounded h-full w-1/4"
                          >
                            Cancel
                          </button>
                        </Link>
                        <button
                          key="preview"
                          type="default"
                          onClick={() => {
                            handlePreviewForm();
                          }}
                          className="py-3 h-full rounded toggle-btn-bg text-white lg:mx-4 w-1/4  my-1"
                        >
                          Preview
                        </button>
                        <button
                          key="add"
                          type="submit"
                          className=" px-4 py-3 h-full rounded primary-bg-btn text-white w-1/4 my-1"
                        >
                          Create
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddEditReviewComponent;
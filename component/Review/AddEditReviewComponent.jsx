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
  const [userList, setUserList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [previewForm, setPreviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({});
  const [nextFormFeild, setNextFormFeild] = useState(0);
  const [disable, setDisable] = useState({
    review_name: false,
    template_id: false,
    frequency: false,
    assigned_to_id: false,
    review_type: false,
  });

  const validateMessages = {
    required: "${label} is required!",
  };

  const onInputChange = (value, name) => {
    if (value && name) {
      setDisable((prev) => ({ ...prev, [`${name}`]: true }));
    } else {
      setDisable((prev) => ({ ...prev, [`${name}`]: false }));
    }
  };

  function onFinish(type) {
    let values = form.getFieldsValue(true);

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

      is_published: "published",
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

  async function fetchUserData() {
    setUserList([]);
    await fetch("/api/user/organizationId/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter(
            (item) => item.user.status && item.user_id != user.id
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
                      className="py-3 h-full rounded toggle-btn-bg text-white lg:mx-4 w-1/4 my-1"
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
          <div className="w-full bg-white rounded-md shadow-md mt-4 add-template-wrapper">
            <div className=" mt-1">
              <div className=" w-full flex flex-col items-start">
                <Form
                  layout="vertical"
                  form={form}
                  // onFinish={onFinish}
                  className="w-full"
                >
                  <Row gutter={16}>
                    <Col md={24} xs={24}>
                      <div className="review-form-bg rounded-md h-full w-full">
                        {nextFormFeild === 0 && (
                          <div className="py-24 flex flex-col items-center justify-center">
                            <p className="text-xl font-bold my-5 primary-color-blue">
                              Please enter your feedback title
                            </p>

                            <div className=" text-left w-96">
                              <Form.Item
                                name="review_name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter your feedback title",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="for eg: Monthly feedback , Lastest trip review , weekly feedback ... "
                                  onChange={(e) =>
                                    onInputChange(e.target.value, "review_name")
                                  }
                                />
                              </Form.Item>
                            </div>
                            <div className="my-5">
                              <button
                                className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                onClick={() => setNextFormFeild(1)}
                                disabled={!disable.review_name}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                        {nextFormFeild === 1 && (
                          <div className="py-24 flex flex-col items-center justify-center px-4">
                            <p className="text-xl font-bold my-5 primary-color-blue">
                              Please select your feedback template
                            </p>

                            <div className=" text-left w-96">
                              <Form.Item
                                name="template_id"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please select your feedback template",
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
                                  onChange={(e) =>
                                    onInputChange(e, "template_id")
                                  }
                                >
                                  {formList.map((data, index) => (
                                    <Select.Option
                                      key={index + "form"}
                                      value={data.id}
                                    >
                                      {data.form_title}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                            <div className="my-5">
                              <button
                                className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                onClick={() => setNextFormFeild(2)}
                                disabled={!disable.template_id}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                        {nextFormFeild === 2 && (
                          <div className="py-24 flex flex-col items-center justify-center px-4">
                            <p className="text-xl font-bold my-5 primary-color-blue">
                              Please select feedback Frequency
                            </p>

                            <div className=" text-left w-96">
                              <Form.Item
                                name="frequency"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please select your feedback frequency",
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="Select Frequency"
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  onChange={(e) =>
                                    onInputChange(e, "frequency")
                                  }
                                >
                                  <Select.Option value="once">
                                    Once
                                  </Select.Option>
                                  <Select.Option value="daily">
                                    Daily
                                  </Select.Option>
                                  <Select.Option value="weekly">
                                    Weekly
                                  </Select.Option>
                                  <Select.Option value="monthly">
                                    Monthly
                                  </Select.Option>
                                </Select>
                              </Form.Item>
                            </div>
                            <div className="my-5">
                              <button
                                className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                onClick={() => setNextFormFeild(3)}
                                disabled={!disable.frequency}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                        {nextFormFeild === 3 && (
                          <div className="py-24 flex flex-col items-center justify-center px-4">
                            <p className="text-xl font-bold my-5 primary-color-blue">
                              Please select your team members, who should be
                              giving feedback to you ?
                            </p>

                            <div className=" text-left w-96">
                              <Form.Item
                                name="assigned_to_id"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select your team members",
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
                                  onChange={(e) =>
                                    onInputChange(e, "assigned_to_id")
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
                            </div>
                            <div className="my-5">
                              <button
                                className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                onClick={() => setNextFormFeild(4)}
                                disabled={!disable.assigned_to_id}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                        {nextFormFeild === 4 && (
                          <div className="py-24 flex flex-col items-center justify-center px-4">
                            <p className="text-xl font-bold my-5 primary-color-blue">
                              Would you like to let your team members rate you ?
                            </p>

                            <div className=" text-left w-96">
                              <Form.Item
                                name="review_type"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select your review type",
                                  },
                                ]}
                              >
                                <Radio.Group
                                  placeholder="Select Type"
                                  onChange={(e) =>
                                    onInputChange(e, "review_type")
                                  }
                                >
                                  <Radio value="feedback">yes</Radio>
                                  <Radio value="other">no</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            <div className="my-5">
                              <button
                                className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                onClick={() => onFinish()}
                                disabled={!disable.review_type}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>

                    {/* <Col md={24} xs={24}>
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
                    </Col> */}
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

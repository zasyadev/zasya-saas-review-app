import React, { useEffect, useState } from "react";
import { Form, Row, Col, Select, Input, Radio, Spin } from "antd";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../helpers/notification";
import Link from "next/link";
import EditorWrapperComponent from "./EditorWrapperComponent";
import { LoadingOutlined } from "@ant-design/icons";

const defaultScaleQuestion = {
  questionText: "Rating",
  options: [{ optionText: "low" }, { optionText: "high" }],
  lowerLabel: 1,
  higherLabel: 10,
  open: false,
  type: "scale",
  editableFeedback: true,
};

function AddEditReviewComponent({
  user,
  previewForm = false,
  reviewPreviewData,
  reviewId,
}) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [formList, setFormList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [reviewFormData, setReviewFormData] = useState({});
  const [formTitle, setFormTitle] = useState("");
  const [nextFormFeild, setNextFormFeild] = useState(0);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [disable, setDisable] = useState({
    review_name: false,
    template_id: false,
    review_type: false,
  });

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "white",
      }}
      spin
    />
  );

  const onInputChange = (value, name) => {
    if (value && name) {
      setDisable((prev) => ({ ...prev, [`${name}`]: true }));
    } else {
      setDisable((prev) => ({ ...prev, [`${name}`]: false }));
    }
  };
  const onBarInputChange = (value, name) => {
    if (value && name) {
      if ((name = "assigned_to_id" && userList.length > 0)) {
        if (value.includes("all")) {
          let allUsers = userList.map((item) => {
            return item.user.id;
          });
          userForm.setFieldsValue({
            assigned_to_id: allUsers,
          });
        }
      }
    }
  };

  function onPreviewSubmit() {
    let values = userForm.getFieldsValue(true);

    if (!values.frequency) {
      openNotificationBox("error", "Need to Select Frequency", 3);
    } else if (!values.assigned_to_id) {
      openNotificationBox("error", "Need to Select Members", 3);
    } else {
      if (Object.keys(reviewFormData).length && reviewId) {
        addReviewAssign({
          created_by: user.id,
          assigned_to_id: values.assigned_to_id,
          review_type: reviewFormData.review_type,
          review_name: reviewFormData.review_name,
          status: reviewFormData.status ?? "pending",
          frequency: values.frequency,
          role_id: user.role_id,
          is_published: "published",
          templateData: questionList,
          review_id: reviewId,
        });
      }
    }
  }

  async function addReviewAssign(obj) {
    // console.log(obj, "sdfsdsf");
    // return;

    await fetch("/api/review/manage", {
      method: "POST",
      body: JSON.stringify(obj),
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

  const initialData = (data) => {
    setFormTitle(data.template_data.form_title);
    setQuestionList(data.template_data.form_data.questions);
    setReviewFormData(data);
  };

  useEffect(() => {
    fetchUserData();
    fetchTemplateData();

    if (
      reviewPreviewData &&
      Object.keys(reviewPreviewData).length &&
      previewForm
    ) {
      initialData(reviewPreviewData);
    }
  }, []);

  const handlePreviewForm = async () => {
    setReviewFormData({});
    setQuestionList([]);
    setLoadingSpin(true);

    let values = form.getFieldsValue(true);

    if (values) {
      let templateData = {};
      if (values.template_id) {
        templateData = formList.find((item) => item.id == values.template_id);

        if (values.review_type === "feedback") {
          templateData.form_data.questions.length > 0
            ? templateData.form_data.questions.push(defaultScaleQuestion)
            : null;
        }

        await fetch("/api/review/manage", {
          method: "POST",
          body: JSON.stringify({
            ...values,
            template_data: templateData,
            is_published: "draft",
            status: values.status ?? "pending",
            role_id: user.role_id,
            created_by: user.id,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.status === 200 && response.data.id) {
              router.push(`/review/edit/${response.data.id}`);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        openNotificationBox("error", "Need to Select Template", 3);
      }
    }
  };

  return (
    <>
      {previewForm ? (
        <>
          <div className="w-full   ">
            <div className="w-full rounded-xl  p-4 mt-4 template-wrapper flex flex-col">
              <Form layout="vertical" form={userForm}>
                <div className="primary-bg-color px-4 py-4 rounded-t-md items-center">
                  <Row gutter={[16, 16]} justify="between" align="middle">
                    <Col md={6} xs={24}>
                      <div className="text-center md:text-left">
                        <p className="text-white text-base font-medium mb-1">
                          Review Name : {reviewFormData.review_name}
                        </p>
                      </div>
                    </Col>
                    <Col md={6} xs={24}>
                      <div className="h-full w-11/12">
                        <Form.Item name="frequency" className="mb-0">
                          <Select
                            placeholder="Select Frequency"
                            showSearch
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => onBarInputChange(e, "frequency")}
                            size="large"
                          >
                            <Select.Option value="once">Once</Select.Option>
                            <Select.Option value="daily">Daily</Select.Option>
                            <Select.Option value="weekly">Weekly</Select.Option>
                            <Select.Option value="monthly">
                              Monthly
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col md={6} xs={24}>
                      <div className="w-11/12 h-full">
                        <Form.Item name="assigned_to_id" className="mb-0">
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
                              onBarInputChange(e, "assigned_to_id")
                            }
                            size="large"
                            className="w-full"
                            maxTagCount="responsive"
                          >
                            <Select.Option key="all" value="all">
                              ---SELECT ALL---
                            </Select.Option>
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
                    </Col>
                    <Col md={6} xs={24}>
                      <div className="text-center md:text-right">
                        <p className="text-white text-base font-medium mb-1">
                          Review Type : {reviewFormData.review_type}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Form>
              <div className="bg-white px-4 rounded-b-md">
                <EditorWrapperComponent
                  questions={questionList}
                  setQuestionList={setQuestionList}
                  setFormTitle={setFormTitle}
                  formTitle={formTitle}
                />

                {/* {questionList.length > 0 &&
                  questionList?.map((question, idx) => (
                    <>
                      <ReviewViewComponent
                        {...question}
                        idx={idx}
                        removeElement={removeElement}
                        setIsModalVisible={setIsModalVisible}
                        isModalVisible={isModalVisible}
                        onHandleReviewChange={onHandleReviewChange}
                      />

                      <TemplateEditor
                        {...question}
                        idx={idx}
                        removeElement={removeElement}
                        setIsModalVisible={setIsModalVisible}
                        isModalVisible={isModalVisible}
                        onHandleReviewChange={onHandleReviewChange}
                      />
                    </>
                  ))} */}
                <div>
                  <div className="flex justify-end my-5">
                    <button
                      key="cancel"
                      type="default"
                      onClick={() => {
                        // setPreviewForm(false);
                        setReviewFormData({});
                        setQuestionList([]);
                        router.back();
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
                <Form layout="vertical" form={form} className="w-full">
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
                                  size="large"
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
                              <Link href="/template/add" passHref>
                                <a target="_blank">
                                  <p className="text-right">Create</p>
                                </a>
                              </Link>
                            </div>
                            <div className="my-5">
                              <button
                                className="primary-bg-btn rounded-md text-lg text-white px-14 py-2 mr-2"
                                onClick={() => setNextFormFeild(0)}
                              >
                                Previous
                              </button>

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
                        {/* {nextFormFeild === 2 && (
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
                                  size="large"
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
                                className="primary-bg-btn rounded-md text-lg text-white px-14 py-2 mr-2"
                                onClick={() => setNextFormFeild(1)}
                              >
                                Previous
                              </button>
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
                                  size="large"
                                >
                                  <Select.Option key="all" value="all">
                                    ---SELECT ALL---
                                  </Select.Option>
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
                              <Link href="/team/add" passHref>
                                <a target="_blank">
                                  <p className="text-right">Create</p>
                                </a>
                              </Link>
                            </div>
                            <div className="my-5">
                              <button
                                className="primary-bg-btn rounded-md text-lg text-white px-14 py-2 mr-2"
                                onClick={() => setNextFormFeild(2)}
                              >
                                Previous
                              </button>
                              <button
                                className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                onClick={() => setNextFormFeild(4)}
                                disabled={!disable.assigned_to_id}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )} */}
                        {nextFormFeild === 2 && (
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
                                    onInputChange(e.target.value, "review_type")
                                  }
                                >
                                  <Radio value="feedback">Yes</Radio>
                                  <Radio value="other">No</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                            <div className="my-5">
                              <button
                                className="primary-bg-btn rounded-md text-lg text-white px-14 py-2 mr-2"
                                onClick={() => setNextFormFeild(1)}
                              >
                                Previous
                              </button>
                              {loadingSpin ? (
                                <button
                                  className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                  disabled={true}
                                >
                                  <Spin indicator={antIcon} />
                                </button>
                              ) : (
                                <button
                                  className="toggle-btn-bg rounded-md text-lg text-white px-14 py-2 "
                                  onClick={() => handlePreviewForm()}
                                  disabled={!disable.review_type}
                                >
                                  Preview
                                </button>
                              )}
                            </div>
                          </div>
                        )}
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

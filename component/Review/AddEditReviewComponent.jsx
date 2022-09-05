import { LoadingOutlined } from "@ant-design/icons";
import { Col, Form, Input, Radio, Row, Select, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import EditorWrapperComponent from "./EditorWrapperComponent";

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
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
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
    setLoadingSubmitSpin(true);

    if (!values.frequency) {
      openNotificationBox("error", "Need to Select Frequency", 3);
      return;
    }
    if (!values.assigned_to_id) {
      openNotificationBox("error", "Need to Select Members", 3);
      return;
    }
    if (values.assigned_to_id && values.assigned_to_id.length == 0) {
      openNotificationBox("error", "Need to Select Members", 3);
      return;
    }

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

  async function addReviewAssign(obj) {
    await httpService
      .post(`/api/review/manage`, obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          router.push("/review");
          openNotificationBox("success", response.message, 3);
        }
        // setLoadingSubmitSpin(false);
      })
      .catch((err) => {
        console.error(err.response.data.message);
        openNotificationBox("error", err.response.data.message, 3);
        setLoadingSubmitSpin(false);
      });
  }

  async function fetchTemplateData() {
    setFormList([]);
    await httpService
      .get(`/api/template/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter((item) => item.status);
          setFormList(filterData);
        }
      })
      .catch((err) => {
        setFormList([]);
        console.error(err.response.data.message);
      });
  }

  async function fetchUserData() {
    setUserList([]);
    await httpService
      .get(`/api/user/organizationId/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter(
            (item) => item.user.status && item.user_id != user.id
          );
          setUserList(filterData);
        }
      })
      .catch((err) => {
        setUserList([]);
        console.error(err.response.data.message);
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

        await httpService
          .post(`/api/review/manage`, {
            ...values,
            template_data: templateData,
            is_published: "draft",
            status: values.status ?? "pending",
            role_id: user.role_id,
            created_by: user.id,
          })
          .then(({ data: response }) => {
            if (response.status === 200 && response.data.id) {
              router.push(`/review/edit/${response.data.id}`);
            }
          })
          .catch((err) => {
            console.error(err.response.data.message);
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
                          Name : {reviewFormData.review_name}
                        </p>
                      </div>
                    </Col>
                    <Col md={6} xs={24}>
                      <div className="h-full w-11/12">
                        <Form.Item name="frequency" className="mb-0 margin-b-0">
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
                        <Form.Item
                          name="assigned_to_id"
                          className="mb-0 margin-b-0"
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
                        <p className="text-white text-base font-medium mb-1 capitalize">
                          Type : {reviewFormData.review_type}
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

                <div>
                  <div className="flex justify-end my-5">
                    <SecondaryButton
                      onClick={() => {
                        setReviewFormData({});
                        setQuestionList([]);
                        router.back();
                      }}
                      className="h-full rounded mr-2 lg:mx-4 md:w-1/4 my-1"
                      title="Cancel"
                    />

                    <PrimaryButton
                      onClick={() => onPreviewSubmit()}
                      className="h-full rounded md:w-1/4 my-1"
                      title={
                        loadingSubmitSpin ? (
                          <Spin indicator={antIcon} />
                        ) : (
                          "Submit"
                        )
                      }
                      btnProps={{
                        disabled: loadingSubmitSpin,
                      }}
                    />
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
                              <SecondaryButton
                                onClick={() => setNextFormFeild(1)}
                                btnProps={{
                                  disabled: !disable.review_name,
                                }}
                                className="px-14 py-2 text-base rounded-md"
                                title="Next"
                              />
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
                              <PrimaryButton
                                onClick={() => setNextFormFeild(0)}
                                className="px-14 py-2 text-base rounded-md mr-2"
                                title="Previous"
                              />
                              <SecondaryButton
                                onClick={() => setNextFormFeild(2)}
                                btnProps={{
                                  disabled: !disable.template_id,
                                }}
                                className="px-14 py-2 text-base rounded-md"
                                title="Next"
                              />
                            </div>
                          </div>
                        )}

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
                              <PrimaryButton
                                onClick={() => setNextFormFeild(1)}
                                className="px-14 py-2 text-base rounded-md mr-2"
                                title="Previous"
                              />
                              {loadingSpin ? (
                                <SecondaryButton
                                  btnProps={{
                                    disabled: true,
                                  }}
                                  className="px-14 py-2 text-base rounded-md"
                                  title={<Spin indicator={antIcon} />}
                                />
                              ) : (
                                <SecondaryButton
                                  onClick={() => handlePreviewForm()}
                                  btnProps={{
                                    disabled: !disable.review_type,
                                  }}
                                  className="px-14 py-2 text-base rounded-md"
                                  title="Preview"
                                />
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

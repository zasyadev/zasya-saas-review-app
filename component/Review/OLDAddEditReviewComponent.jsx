import { Col, Form, Row, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import GetReviewSteps from "../common/GetReviewSteps";
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
  const [activeReviewStep, setActiveReviewStep] = useState(0);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [disable, setDisable] = useState({
    0: false,
    1: false,
    2: false,
  });

  const onInputChange = (value, type) => {
    setDisable((prev) => ({ ...prev, [type]: value ? true : false }));
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
      let newQuestionData = questionList.map((item) => {
        let error = "";
        if (!item.questionText || item.questionText.trim() === "") {
          error = "Question field required!";
        }
        let errorOptions = item.options;
        if (
          item.options.length &&
          (item.type === "checkbox" || item.type === "scale")
        ) {
          errorOptions = item.options.map((option) => {
            let error = "";
            if (!option.optionText) {
              error = "Option field required!";
            }
            return {
              ...option,
              error: error,
            };
          });
        }

        return {
          ...item,
          open: true,
          error: error,
          options: errorOptions,
        };
      });

      setQuestionList(newQuestionData);

      if (newQuestionData.filter((item) => item.error).length > 0) {
        openNotificationBox("error", "Field(s) Required", 3);
        return;
      }
      if (
        newQuestionData.filter(
          (item) =>
            item.options.filter((option) => option.error).length > 0 ?? false
        ).length > 0
      ) {
        openNotificationBox("error", "Option Field(s) Required", 3);
        return;
      }

      addReviewAssign({
        created_by: user.id,
        assigned_to_id: values.assigned_to_id,
        review_type: reviewFormData.review_type,
        review_name: reviewFormData.review_name,
        status: reviewFormData.status ?? "pending",
        frequency: values.frequency,
        role_id: user.role_id,
        is_published: "published",
        templateData: newQuestionData,
        review_id: reviewId,
      });
    }
  }

  async function addReviewAssign(obj) {
    setLoadingSubmitSpin(true);
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
        console.error(err.response.data?.message);
        openNotificationBox("error", err.response.data?.message, 3);
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
        console.error(err.response.data?.message);
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
        console.error(err.response.data?.message);
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
            console.error(err.response.data?.message);
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
            <div className="w-full rounded-md  p-4 mt-4 template-wrapper flex flex-col">
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
                      title={"Submit"}
                      loading={loadingSubmitSpin}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full bg-white rounded-md shadow-md mt-4 add-template-wrapper">
          <div className=" mt-1">
            <div className=" w-full flex flex-col items-start">
              <Form layout="vertical" form={form} className="w-full">
                <Row gutter={16}>
                  <Col md={24} xs={24}>
                    <div className="review-form-bg rounded-md h-full w-full">
                      <div className="py-24 flex flex-col items-center justify-center px-4">
                        {GetReviewSteps({
                          onInputChange,
                          formList,
                          type: activeReviewStep,
                        })}
                        <div className="mt-5 space-x-5">
                          {activeReviewStep !== 0 && (
                            <SecondaryButton
                              onClick={() =>
                                setActiveReviewStep(activeReviewStep - 1)
                              }
                              disabled={loadingSpin}
                              title="Previous"
                              className="bg-gray-400"
                            />
                          )}

                          {activeReviewStep !== 2 ? (
                            <PrimaryButton
                              onClick={() =>
                                setActiveReviewStep(activeReviewStep + 1)
                              }
                              disabled={!disable[activeReviewStep]}
                              title="Next"
                            />
                          ) : (
                            <PrimaryButton
                              onClick={() => handlePreviewForm()}
                              loading={loadingSpin}
                              disabled={!disable[activeReviewStep]}
                              title="Preview"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddEditReviewComponent;

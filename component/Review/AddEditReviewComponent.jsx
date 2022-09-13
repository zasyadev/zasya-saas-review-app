import { Col, Form, Row, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import {
  CustomStepsHeaderWrapper,
  CustomStepsWrapper,
} from "../common/CustomSteps";
import GetReviewSteps from "../common/GetReviewSteps";
import EditorWrapperComponent from "./EditorWrapperComponent";

const defaultOption = { optionText: "", error: "" };

const defaultScaleQuestion = {
  questionText: "Rating",
  options: [{ optionText: "low" }, { optionText: "high" }],
  lowerLabel: 1,
  higherLabel: 10,
  open: false,
  type: "scale",
  editableFeedback: true,
};
const defaultQuestionConfig = {
  questionText: "",
  options: [defaultOption],
  open: true,
  type: "checkbox",
  error: "",
  active: true,
};

const stepsArray = [
  {
    step: 0,
    key: "review_title",
    title: "Review Title",
  },
  {
    step: 1,
    key: "template_preview",
    title: "View Your Template",
  },
  {
    step: 2,
    key: "select_members",
    title: "Select Your Members",
  },
];

function AddEditReviewComponent({
  user,
  previewForm = false,
  reviewPreviewData,
  reviewId,
  pageTitle,
}) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [formList, setFormList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [questionList, setQuestionList] = useState([defaultQuestionConfig]);
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

  const [templateSaveLoading, setTemplateSaveLoading] = useState(false);

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
          form.setFieldsValue({
            assigned_to_id: allUsers,
          });
        }
      }
    }
  };

  function onPreviewSubmit() {
    let values = form.getFieldsValue(true);

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

    // if (Object.keys(reviewFormData).length) {
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

    if (values.review_type === "feedback") {
      newQuestionData.length > 0
        ? newQuestionData.push(defaultScaleQuestion)
        : null;
    }

    addReviewAssign({
      created_by: user.id,
      assigned_to_id: values.assigned_to_id,
      review_type: values.review_type,
      review_name: values.review_name,
      status: values.status ?? "pending",
      frequency: values.frequency,
      role_id: user.role_id,
      is_published: "published",
      templateData: newQuestionData,
      // review_id: reviewId,
    });
    // }
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
    setQuestionList(data.form_data.questions);
    form.setFieldsValue({
      review_name: data?.form_title,
    });
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

  // const templateFormData = useMemo(() => {
  //   let values = form.getFieldsValue(true);

  //   let data = formList.find((item) => item.id == values.template_id);
  //   setQuestionList(data ? data.form_data.questions : []);
  // }, [form.getFieldsValue(true)]);

  // const handlePreviewForm = async () => {
  //   setReviewFormData({});
  //   setQuestionList([]);
  //   setLoadingSpin(true);

  //   let values = form.getFieldsValue(true);

  //   if (values) {
  //     let templateData = {};
  //     if (values.template_id) {
  //       templateData = formList.find((item) => item.id == values.template_id);

  //       if (values.review_type === "feedback") {
  //         templateData.form_data.questions.length > 0
  //           ? templateData.form_data.questions.push(defaultScaleQuestion)
  //           : null;
  //       }

  //       await httpService
  //         .post(`/api/review/manage`, {
  //           ...values,
  //           template_data: templateData,
  //           is_published: "draft",
  //           status: values.status ?? "pending",
  //           role_id: user.role_id,
  //           created_by: user.id,
  //         })
  //         .then(({ data: response }) => {
  //           if (response.status === 200 && response.data.id) {
  //             router.push(`/review/edit/${response.data.id}`);
  //           }
  //         })
  //         .catch((err) => {
  //           console.error(err.response.data?.message);
  //         });
  //     } else {
  //       openNotificationBox("error", "Need to Select Template", 3);
  //     }
  //   }
  // };

  return (
    <div className="px-4 md:px-6 pb-28 pt-20 md:pt-20 md:pb-24  bg-color-dashboard min-h-screen">
      <CustomStepsHeaderWrapper title={pageTitle} backUrl={"/review"} />

      <div className="">
        <Form layout="vertical" form={form} className="w-full">
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <div className=" w-full">
                {GetReviewSteps({
                  onInputChange,
                  formList,
                  type: activeReviewStep,
                  questionList,
                  setQuestionList,
                  onBarInputChange,
                  userList,
                })}
                {/* <div className="mt-5 space-x-5">
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
                        </div> */}
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      <CustomStepsWrapper
        activeStepState={activeReviewStep}
        setActiveStepState={setActiveReviewStep}
        stepsArray={stepsArray}
        lastStep={2}
        previewStep={5}
        submitLoading={templateSaveLoading}
        submitHandle={onPreviewSubmit}
      />

      {/* <div className="fixed bottom-0 left-0 right-0">
        <div className=" bg-white p-5 rounded-md w-full">
          <div className="flex justify-between  items-center">
            <div className="w-full md:w-1/2 mx-auto hidden md:block">
              <CustomSteps
                activeStepState={activeReviewStep}
                setActiveStepState={setActiveReviewStep}
                stepsArray={stepsArray}
                responsive={false}
              />
            </div>
            <div className="w-full md:w-1/2 mx-auto md:hidden block">
              {activeReviewStep ? (
                <span
                  onClick={() => {
                    setActiveReviewStep(activeReviewStep - 1);
                  }}
                >
                  <LeftOutlined style={{ fontSize: "28px" }} />
                </span>
              ) : null}
            </div>
            <div className="text-primary ">
              <PrimaryButton
                title={
                  activeReviewStep === 3
                    ? "Submit"
                    : activeReviewStep === 1
                    ? "Preview"
                    : "Continue"
                }
                onClick={() => {
                  setActiveReviewStep(activeReviewStep + 1);
                  // if (activeReviewStep === 2) saveFormField();
                }}
                loading={templateSaveLoading}
                disabled={!disable[activeReviewStep]}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default AddEditReviewComponent;

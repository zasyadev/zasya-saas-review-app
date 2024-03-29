import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import {
  defaultQuestionConfig,
  defaultRatingQuestion,
} from "../Form/questioncomponents/constants";
import GetReviewSteps from "../common/GetReviewSteps";
import StepFixedHeader from "../common/StepFixedHeader";
import StepsBottomFixedBar from "../common/StepsBottomFixedBar";
import { useOrganizationUser } from "../common/hooks/useOrganizationUser";
import { ReviewStepsArray } from "./constants";

function AddEditReviewComponent({
  user,
  previewForm = false,
  reviewPreviewData,
  pageTitle,
}) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [questionList, setQuestionList] = useState([defaultQuestionConfig]);
  const [activeReviewStep, setActiveReviewStep] = useState(0);
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const { userList } = useOrganizationUser(user.id);

  const onBarInputChange = (value, name) => {
    if (value && name) {
      if (name == "assigned_to_id" && userList.length > 0) {
        if (value.includes("all")) {
          let allUsers = userList.map((item) => {
            return item.user.id;
          });
          form.setFieldsValue({
            assigned_to_id: allUsers,
          });
        }
      }
      if (name == "rating") {
        if (value === "feedback") {
          setQuestionList((prev) => [...prev, defaultRatingQuestion]);
        } else {
          setQuestionList((prev) =>
            prev.filter((item) => !item.ratingFeedback)
          );
        }
      }
    }
  };

  function onPreviewSubmit() {
    let values = form.getFieldsValue(true);

    addReviewAssign({
      created_by: user.id,
      assigned_to_id: values.assigned_to_id,
      review_type: values.review_type,
      review_name: values.review_name,
      status: values.status ?? "pending",
      frequency: values.frequency,
      role_id: user.role_id,
      is_published: "published",
      templateData: questionList,
    });
  }

  async function addReviewAssign(obj) {
    setLoadingSubmitSpin(true);
    await httpService
      .post(`/api/review/manage`, obj)
      .then(({ data: response }) => {
        router.push("/review");
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) =>
        openNotificationBox("error", err.response.data?.message, 3)
      )
      .finally(() => setLoadingSubmitSpin(false));
  }

  const initialData = (data) => {
    setQuestionList(data.form_data.questions);
    form.setFieldsValue({
      review_name: data?.form_title,
      review_des: data?.form_description,
    });
  };

  useEffect(() => {
    if (
      reviewPreviewData &&
      Object.keys(reviewPreviewData).length &&
      previewForm
    ) {
      initialData(reviewPreviewData);
    }
  }, []);

  const nextTitleStep = (type) => {
    let values = form.getFieldsValue(true);

    if (values.review_name) {
      setActiveReviewStep(type + 1);
    } else {
      openNotificationBox("error", "Feedback Title Required", 3);
    }
  };
  const nextMembersListStep = (type) => {
    let values = form.getFieldsValue(true);

    if (!values.frequency) {
      openNotificationBox("error", "Need to Select Feedback Frequency", 3);
      return;
    }
    if (!Number(values?.assigned_to_id?.length)) {
      openNotificationBox("error", "Need to Select Feedback Members", 3);
      return;
    }
    setActiveReviewStep(type + 1);
  };

  const nextQuestionListStep = (type) => {
    let newQuestionData = questionList.map((item) => {
      let error = "";
      if (!item.questionText || item.questionText.trim() === "") {
        error = "Question field required!";
      }
      let errorOptions = item.options;
      if (item.type === "checkbox") {
        if (item.options.length < 2) {
          error = "Minimum 2 options  required!";
        }
      }
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
    setActiveReviewStep(type + 1);
  };

  const nextStepHandller = (key) => {
    switch (key) {
      case 0:
        return nextTitleStep(key);
      case 1:
        return nextQuestionListStep(key);
      case 2:
        return nextMembersListStep(key);
      case 3:
        return onPreviewSubmit();

      default:
        return null;
    }
  };

  return (
    <div className="px-4 md:px-6 pb-28 pt-20 md:pt-20 md:pb-24  bg-gray-100 min-h-screen">
      <StepFixedHeader title={pageTitle} backUrl={"/review"} />

      <div className="">
        <Form layout="vertical" form={form} className="w-full">
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <div className=" w-full">
                {GetReviewSteps({
                  type: activeReviewStep,
                  questionList,
                  setQuestionList,
                  onBarInputChange,
                  userList,
                  formTitle: form.getFieldsValue(true)?.review_name,
                })}
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      <StepsBottomFixedBar
        activeStepState={activeReviewStep}
        setActiveStepState={setActiveReviewStep}
        stepsArray={ReviewStepsArray}
        lastStep={3}
        previewStep={2}
        submitLoading={loadingSubmitSpin}
        nextStepHandller={nextStepHandller}
      />
    </div>
  );
}

export default AddEditReviewComponent;

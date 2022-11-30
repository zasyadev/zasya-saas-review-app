import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import GetSurveySteps from "../common/GetSurveySteps";
import { openNotificationBox } from "../common/notification";
import StepFixedHeader from "../common/StepFixedHeader";
import StepsBottomFixedBar from "../common/StepsBottomFixedBar";
import { SurveyStepsArray } from "./constants";

const defaultOption = { optionText: "", error: "" };

const defaultQuestionConfig = {
  questionText: "",
  options: [defaultOption],
  open: true,
  type: "checkbox",
  error: "",
  active: true,
};

function AddEditSurveyComponent({
  user,
  previewForm = false,
  surveyPreviewData,
  pageTitle,
}) {
  const [form] = Form.useForm();
  const [questionList, setQuestionList] = useState([defaultQuestionConfig]);
  const [activeSurveyStep, setActiveSurveyStep] = useState(0);
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [urlId, setUrlId] = useState("");

  function onPreviewSubmit(type) {
    let values = form.getFieldsValue(true);

    addSurvey({
      created_by: user.id,
      survey_name: values.survey_name,
      status: values.status ?? "active",
      role_id: user.role_id,
      templateData: questionList,
      activeType: type,
      channelType: "Link",
    });
  }

  async function addSurvey(obj) {
    setLoadingSubmitSpin(true);
    await httpService
      .post(`/api/survey/add`, obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          // router.push("/survey");
          openNotificationBox("success", response.message, 3);
          if (response.data.url_id) {
            setUrlId(response.data.url_id);
            setActiveSurveyStep(obj.activeType + 1);
          }
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message, 3);
        setLoadingSubmitSpin(false);
      });
  }

  const initialData = (data) => {
    setQuestionList(data.form_data.questions);
    form.setFieldsValue({
      survey_name: data?.form_title,
      survey_des: data?.form_description,
    });
  };

  useEffect(() => {
    if (
      surveyPreviewData &&
      Object.keys(surveyPreviewData).length &&
      previewForm
    ) {
      initialData(surveyPreviewData);
    }
  }, []);

  const nextTitleStep = (type) => {
    let values = form.getFieldsValue(true);

    if (values.survey_name) {
      setActiveSurveyStep(type + 1);
    } else {
      openNotificationBox("error", "Survey Title Required", 3);
    }
  };

  const nextQuestionListStep = (type) => {
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
    setActiveSurveyStep(type + 1);
  };

  const nextStepHandller = (key) => {
    switch (key) {
      case 0:
        return nextTitleStep(key);
      case 1:
        return nextQuestionListStep(key);
      case 2:
        return onPreviewSubmit(key);
      case 3:
        return onPreviewSubmit();

      default:
        return null;
    }
  };

  return (
    <div className="px-4 md:px-6 pb-28 pt-20 md:pt-20 md:pb-24  bg-gray-100 min-h-screen">
      <StepFixedHeader title={pageTitle} backUrl={"/survey"} />

      <div className="">
        <Form layout="vertical" form={form} className="w-full">
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <div className=" w-full">
                {GetSurveySteps({
                  type: activeSurveyStep,
                  questionList,
                  setQuestionList,

                  formTitle: form.getFieldsValue(true)?.survey_name,
                  urlId,
                })}
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      <StepsBottomFixedBar
        activeStepState={activeSurveyStep}
        setActiveStepState={setActiveSurveyStep}
        stepsArray={SurveyStepsArray}
        lastStep={3}
        previewStep={2}
        submitLoading={loadingSubmitSpin}
        nextStepHandller={nextStepHandller}
      />
    </div>
  );
}

export default AddEditSurveyComponent;

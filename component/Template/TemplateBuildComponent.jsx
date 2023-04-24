import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import { URLS } from "../../constants/urls";
import httpService from "../../lib/httpService";
import {
  CustomCheckbox,
  CustomInput,
  CustomTextArea,
} from "../common/CustomFormFeilds";
import ErrorBox from "../common/ErrorBox";
import StepFixedHeader from "../common/StepFixedHeader";
import StepsBottomFixedBar from "../common/StepsBottomFixedBar";
import {
  defaultOption,
  defaultQuestionConfig,
  defaultScaleQuestion,
  MULTIPLE_CHOICE_TYPE,
  SCALE_TYPE,
} from "../Form/questioncomponents/constants";
import { TemplateStepsArray } from "./constants";
import TemplateEditor from "./TemplateEditor";
import { TemplatePreviewComponent } from "./TemplatePreviewComponent";
import { isEmptyStr } from "../../helpers/utils";

function TemplateBuildComponent({ user, editMode, editFormData }) {
  const router = useRouter();
  const [questions, setQuestions] = useState([defaultQuestionConfig]);
  const [formTitle, setFormTitle] = useState({
    value: "",
    error: "",
  });
  const [formDes, setFormDes] = useState("");
  const [defaultTemplate, setDefaultTemplate] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeStepState, setActiveStepState] = useState(0);
  const [selectTypeFeild, setSelectTypeFeild] = useState(true);
  const [ratingState, setRatingState] = useState(false);
  const [templateSaveLoading, setTemplateSaveLoading] = useState(false);

  function removeElement(idx, type) {
    setQuestions((prev) => prev.filter((_, i) => i != idx));

    if (idx > 0) setActiveQuestionIndex(idx - 1);
    else setActiveQuestionIndex(idx);
  }

  function handleTitle(value) {
    let error = "";

    if (isEmptyStr(value)) {
      error = "Required!";
    }
    setFormTitle({ value: value, error });
  }

  function addMoreQuestionField() {
    setQuestions((prev) => [...prev, defaultQuestionConfig]);
    setActiveQuestionIndex(questions.length);
    setSelectTypeFeild(true);
  }

  function addNextQuestionField(idx) {
    setActiveQuestionIndex(idx);
    setQuestions((prev) => [
      ...prev.slice(0, idx),
      defaultQuestionConfig,
      ...prev.slice(idx),
    ]);
  }

  function defineType(type, index) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === index
          ? type === SCALE_TYPE
            ? {
                ...defaultScaleQuestion,
                questionText: item.questionText,
              }
            : {
                ...defaultQuestionConfig,
                questionText: item.questionText,
                type: type,
              }
          : item
      )
    );
  }

  function addOption(idx) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx && item.options.length < 5
          ? {
              ...item,
              options: [...item.options, defaultOption],
            }
          : item
      )
    );
  }

  function handleQuestionValue(text, idx, isRequired = false) {
    let error = "";
    if (isRequired && !text && !text.trim()) {
      error = "Question field required!";
    }

    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, questionText: text, error } : item
      )
    );
  }

  function handleOptionValue(text, idx, j, isRequired = false) {
    let error = "";
    if (isRequired && !text && !text.trim()) {
      error = "Option field required!";
    }
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              options: item.options.map((option, jdx) =>
                jdx === j ? { ...option, optionText: text, error } : option
              ),
            }
          : item
      )
    );
  }

  function handleScaleOptionValue(text, idx, type) {
    const key = type === "lowerLabel" ? "lowerLabel" : "higherLabel";
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              [key]: text,
            }
          : item
      )
    );
  }

  function removeOption(idx, j) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              options: item.options.filter((_, jdx) => j != jdx),
            }
          : item
      )
    );
  }

  function saveFormField() {
    let id = "";
    if (editMode) {
      id = editFormData.id;
    }

    let quesArray = questions.map((item) => ({ ...item, open: false }));

    let obj = {
      form_data: {
        title: formTitle.value ?? "",
        description: formDes ?? "",
        questions: quesArray,
      },
      form_title: formTitle.value ?? "",
      form_description: formDes ?? "",
      status: true,
      default_template: defaultTemplate,
    };
    setTemplateSaveLoading(true);

    editMode ? updateFormData(obj, id) : addNewForm(obj);
  }

  const redirectToTemplate = () => router.push(URLS.TEMPLATE);

  async function updateFormData(obj, id) {
    if (id) {
      obj.id = id;

      await httpService
        .put(`/api/template`, obj)
        .then(({ data: response }) => {
          redirectToTemplate();
          openNotificationBox("success", response.message, 3);
        })
        .catch((err) => {
          setTemplateSaveLoading(false);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function addNewForm(obj) {
    await httpService
      .post(`/api/template`, obj)
      .then(({ data: response }) => {
        redirectToTemplate();
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) => {
        setTemplateSaveLoading(false);
        openNotificationBox("error", err.response.data?.message);
      });
  }

  useEffect(() => {
    if (editMode) {
      setQuestions(editFormData?.form_data?.questions);
      setFormTitle({ value: editFormData?.form_data?.title, error: "" });
      setFormDes(editFormData?.form_data?.description);
      setSelectTypeFeild(false);
    }
  }, []);

  const nextTitleStep = (type) => {
    if (!isEmptyStr(formTitle.value)) {
      setActiveStepState(type + 1);
    } else {
      setFormTitle((prev) => ({ ...prev, error: "Required" }));
    }
  };
  const nextQuestionListStep = (type) => {
    let firstErrorQuestion = -1;

    let newQuestionData = questions.map((item, idx) => {
      let error = "";
      if (!item.questionText || item.questionText.trim() === "") {
        error = "Question field required!";
        if (firstErrorQuestion === -1) {
          firstErrorQuestion = idx;
        }
      }
      let errorOptions = item.options;
      if (
        item.options.length &&
        (item.type === MULTIPLE_CHOICE_TYPE || item.type === SCALE_TYPE)
      ) {
        errorOptions = item.options.map((option) => {
          let error = "";
          if (!option.optionText) {
            error = "Option field required!";
            if (firstErrorQuestion === -1) {
              firstErrorQuestion = idx;
            }
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
    if (firstErrorQuestion !== -1) {
      setActiveQuestionIndex(firstErrorQuestion);
    }
    setQuestions(newQuestionData);
    if (newQuestionData.filter((item) => item.error).length > 0) {
      openNotificationBox("error", "Field(s) Required", 3);

      return;
    }
    if (
      newQuestionData.filter((item) => item.options.length === 0).length > 0
    ) {
      openNotificationBox("error", "Options Required", 3);

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
    setActiveStepState(type + 1);
  };

  const nextStepHandller = (key) => {
    switch (key) {
      case 0:
        return nextTitleStep(key);
      case 1:
        return nextQuestionListStep(key);
      case 2:
        return saveFormField();

      default:
        return null;
    }
  };

  return (
    <div className=" md:px-6 pb-16 pt-14 md:pt-20 md:pb-24 bg-white  md:bg-gray-100 min-h-screen">
      <StepFixedHeader
        title={`${editMode ? "Edit" : "Create"} Template`}
        backUrl={URLS.TEMPLATE}
      />
      {activeStepState === 0 && (
        <div className="w-full md:w-1/2 bg-white pb-2  md:px-5 md:pt-5 md:pb-6 xl:p-8 xl:pt-6 md:rounded-md mx-auto space-y-2 md:space-y-6">
          <div className="text-base md:text-lg xl:text-xl font-bold md:border-b border-gray-200 pb-3">
            Create a Custom Template
          </div>
          <div className="px-4 md:p-0 space-y-2">
            <div className="text-base font-semibold">Title</div>

            <CustomInput
              placeholder="E.g. Template Title"
              customclassname="w-full"
              onChange={(e) => {
                handleTitle(e.target.value);
              }}
              value={formTitle.value}
              size="large"
            />
            <ErrorBox error={formTitle?.error} />
          </div>
          <div className="px-4 md:p-0">
            <div className="text-base font-semibold mb-2">Description</div>

            <CustomTextArea
              placeholder="E.g. Template Description"
              customclassname="w-full"
              rows={5}
              onChange={(e) => {
                setFormDes(e.target.value);
              }}
              value={formDes}
            />
          </div>

          {user?.role_id === 1 && (
            <CustomCheckbox
              title="Check if you want to make this a Default Template"
              onChange={(e) => {
                setDefaultTemplate(e.target.checked);
              }}
              className="font-medium text-sm"
              value={defaultTemplate}
            />
          )}
        </div>
      )}
      {activeStepState === 1 && (
        <TemplateEditor
          questions={questions}
          setActiveQuestionIndex={setActiveQuestionIndex}
          setSelectTypeFeild={setSelectTypeFeild}
          removeElement={removeElement}
          addMoreQuestionField={addMoreQuestionField}
          activeQuestionIndex={activeQuestionIndex}
          defineType={defineType}
          addOption={addOption}
          handleQuestionValue={handleQuestionValue}
          handleOptionValue={handleOptionValue}
          removeOption={removeOption}
          handleScaleOptionValue={handleScaleOptionValue}
          addNextQuestionField={addNextQuestionField}
          selectTypeFeild={selectTypeFeild}
          saveFormField={saveFormField}
          setQuestions={setQuestions}
          ratingState={ratingState}
        />
      )}
      {activeStepState === 2 && questions.length && (
        <TemplatePreviewComponent
          length={questions.length}
          formTitle={formTitle.value}
          questions={questions}
        />
      )}

      <StepsBottomFixedBar
        activeStepState={activeStepState}
        setActiveStepState={setActiveStepState}
        stepsArray={TemplateStepsArray}
        lastStep={2}
        previewStep={1}
        submitLoading={templateSaveLoading}
        nextStepHandller={nextStepHandller}
      />
    </div>
  );
}

export default TemplateBuildComponent;

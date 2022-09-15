import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import TemplateEditor from "./TemplateEditor";
import {
  CustomStepsHeaderWrapper,
  CustomStepsWrapper,
} from "../common/CustomSteps";
import { TemplatePreviewComponent } from "./TemplatePreviewComponent";
import { CustomInput } from "../common/CustomFormFeilds";

const defaultOption = { optionText: "", error: "" };

const defaultQuestionConfig = {
  questionText: "",
  options: [defaultOption],
  open: true,
  type: "checkbox",
  error: "",
  active: true,
};
const defaultScaleQuestion = {
  questionText: "",
  options: [defaultOption, defaultOption],
  lowerLabel: 0,
  higherLabel: 5,
  open: true,
  type: "scale",
  error: "",
};

function TemplateBuildComponent({ user, editMode, editFormData }) {
  const router = useRouter();
  const [questions, setQuestions] = useState([defaultQuestionConfig]);
  const [formTitle, setFormTitle] = useState("");
  const [formDes, setFormDes] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeStepState, setActiveStepState] = useState(0);
  const [selectTypeFeild, setSelectTypeFeild] = useState(true);
  const [templateSaveLoading, setTemplateSaveLoading] = useState(false);

  function removeElement(idx) {
    setQuestions((prev) => prev.filter((_, i) => i != idx));

    if (idx > 0) setActiveQuestionIndex(idx - 1);
    else setActiveQuestionIndex(idx);
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
          ? type === "scale"
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

  function showAsQuestion(index) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, open: false } : item))
    );
  }

  function handleExpand(idx) {
    setQuestions((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, open: true } : item))
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
      user_id: user.id,
      form_data: {
        title: formTitle ?? "",
        description: formDes ?? "",
        questions: quesArray,
      },
      form_title: formTitle ?? "",
      form_description: formDes ?? "",
      status: true,
      questions: quesArray,
    };
    setTemplateSaveLoading(true);

    editMode ? updateFormData(obj, id) : addNewForm(obj);
  }

  async function updateFormData(obj, id) {
    if (id) {
      obj.id = id;

      await httpService
        .put(`/api/template`, obj)
        .then(({ data: response }) => {
          if (response.status === 200) {
            router.push("/template");
            openNotificationBox("success", response.message, 3);
          }
        })
        .catch((err) => {
          console.error(err.response.data?.message);
          setTemplateSaveLoading(false);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function addNewForm(obj) {
    await httpService
      .post(`/api/template`, obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          router.push("/template");
          openNotificationBox("success", response.message, 3);
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setTemplateSaveLoading(false);
        openNotificationBox("error", err.response.data?.message);
      });
  }

  useEffect(() => {
    if (editMode) {
      setQuestions(editFormData?.form_data?.questions);
      setFormTitle(editFormData?.form_data?.title);
      setFormDes(editFormData?.form_data?.description);
      // setModalTitleOpen(false);
    }
  }, []);

  // const handleOk = () => {
  //   if (formTitle) setModalTitleOpen(false);
  // };

  const nextTitleStep = (type) => {
    if (formTitle) {
      setActiveStepState(type + 1);
    } else {
      openNotificationBox("error", "Template Title Required", 3);
    }
  };
  const nextQuestionListStep = (type) => {
    let newQuestionData = questions.map((item) => {
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

  const stepsArray = [
    {
      step: 0,
      key: "template_title",
      title: "Template Title",
    },
    {
      step: 1,
      key: "template_question",
      title: "Create Your Questions",
    },
    {
      step: 2,
      key: "template_preview",
      title: "Preview Your Questions",
    },
  ];

  return (
    <div className="px-4 md:px-6 pb-28 pt-20 md:pt-20 md:pb-24  bg-color-dashboard min-h-screen">
      <CustomStepsHeaderWrapper
        title={`${editMode ? "Edit" : "Create"} Template`}
        backUrl={"/template"}
      />
      {activeStepState === 0 && (
        <div className="w-full md:w-1/2 bg-white p-2 md:px-5 md:pt-5 md:pb-6 rounded-md mx-auto space-y-6">
          <div className="text-primary text-base md:text-lg  font-bold border-b border-gray-200 pb-2">
            Create a Custom Template
          </div>
          <div className="space-y-2">
            <div className="text-primary text-base font-bold ">Title</div>
            <div className="">
              <CustomInput
                placeholder="Template Title"
                customclassname="w-full"
                onChange={(e) => {
                  setFormTitle(e.target.value);
                }}
                value={formTitle}
                size="large"
              />
            </div>
          </div>
        </div>
      )}
      {activeStepState === 1 && (
        <TemplateEditor
          setFormTitle={setFormTitle}
          questions={questions}
          setActiveQuestionIndex={setActiveQuestionIndex}
          setSelectTypeFeild={setSelectTypeFeild}
          removeElement={removeElement}
          addMoreQuestionField={addMoreQuestionField}
          activeQuestionIndex={activeQuestionIndex}
          editMode={editMode}
          defineType={defineType}
          showAsQuestion={showAsQuestion}
          handleExpand={handleExpand}
          addOption={addOption}
          handleQuestionValue={handleQuestionValue}
          handleOptionValue={handleOptionValue}
          removeOption={removeOption}
          handleScaleOptionValue={handleScaleOptionValue}
          addNextQuestionField={addNextQuestionField}
          selectTypeFeild={selectTypeFeild}
          saveFormField={saveFormField}
          formTitle={formTitle}
          saveWrapper={true}
          setQuestions={setQuestions}
        />
      )}
      {activeStepState === 2 && questions.length && (
        <TemplatePreviewComponent
          length={questions.length}
          formTitle={formTitle}
          questions={questions}
        />
      )}

      <CustomStepsWrapper
        activeStepState={activeStepState}
        setActiveStepState={setActiveStepState}
        stepsArray={stepsArray}
        lastStep={2}
        previewStep={1}
        submitLoading={templateSaveLoading}
        // submitHandle={saveFormField}
        nextStepHandller={nextStepHandller}
      />
    </div>
  );
}

export default TemplateBuildComponent;

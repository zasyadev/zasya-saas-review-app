import { Input } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import TemplateEditor from "./TemplateEditor";
import CustomModal from "../common/CustomModal";

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
  const [selectTypeFeild, setSelectTypeFeild] = useState(false);
  const [modalTitleopen, setModalTitleOpen] = useState(false);

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

    if (formTitle) {
      let quesArray = newQuestionData.map((item) => ({ ...item, open: false }));

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

      editMode ? updateFormData(obj, id) : addNewForm(obj);
    } else {
      openNotificationBox("error", "Template Title Required", 3);
    }
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
          console.error(err.response.data.message);
          openNotificationBox("error", err.response.data.message);
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
        console.error(err.response.data.message);

        openNotificationBox("error", err.response.data.message);
      });
  }

  useEffect(() => {
    if (editMode) {
      setQuestions(editFormData?.form_data?.questions);
      setFormTitle(editFormData?.form_data?.title);
      setFormDes(editFormData?.form_data?.description);
      setModalTitleOpen(false);
    } else {
      setModalTitleOpen(true);
    }
  }, []);

  const handleOk = () => {
    if (formTitle) setModalTitleOpen(false);
  };
  console.log(questions, "questions");

  return (
    <>
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

      <CustomModal
        visible={modalTitleopen}
        title=""
        customFooter
        footer={
          <>
            <SecondaryButton
              withLink={true}
              linkHref="/template"
              className="mx-4 rounded my-1"
              title="Cancel"
            />
            <PrimaryButton
              onClick={() => handleOk()}
              title="Create"
              className=" rounded"
            />
          </>
        }
        modalProps={{ maskClosable: false }}
      >
        <div>
          <div className="text-primary text-base text-center mb-2 font-bold ">
            Template Title
          </div>
          <div>
            <Input
              placeholder="Template Title"
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
}

export default TemplateBuildComponent;

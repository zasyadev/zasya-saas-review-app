import { Button, Input } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";

import { Modal } from "antd";
import httpService from "../../lib/httpService";
import { SecondaryButton } from "../common/CustomButton";
import TemplateEditor from "./TemplateEditor";

const defaultQuestionConfig = {
  questionText: "Untitled Question",
  options: [{ optionText: "Option 1" }],
  open: true,
  type: "checkbox",
  error: "",
  active: true,
};
const defaultScaleQuestion = {
  questionText: "Untitled Question",
  options: [{ optionText: "low" }, { optionText: "high" }],
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
    // expandCloseAll();
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

  //   function expandCloseAll() {
  //     setQuestions((prev) =>
  //       prev.map((item) => (item ? { ...item, open: false } : item))
  //     );
  //   }

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
              options: [
                ...item.options,
                { optionText: `Option ${Number(item.options.length + 1)}` },
              ],
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

  function handleOptionValue(text, idx, j) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              options: item.options.map((option, jdx) =>
                jdx === j ? { ...option, optionText: text } : option
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

      return {
        ...item,
        open: true,
        error: error,
      };
    });

    setQuestions(newQuestionData);

    if (newQuestionData.filter((item) => item.error).length > 0) {
      openNotificationBox("error", "Field(s) Required", 3);
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
      />

      <Modal
        visible={modalTitleopen}
        footer={
          <>
            <SecondaryButton
              withLink={true}
              linkHref="/template"
              className="mx-4 rounded my-1"
              title="Cancel"
            />
            <Button key="add" type="primary" onClick={handleOk}>
              Create Template
            </Button>
          </>
        }
      >
        <div>
          <div className="primary-color-blue text-base text-center mb-2 font-bold ">
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
      </Modal>
    </>
  );
}

export default TemplateBuildComponent;

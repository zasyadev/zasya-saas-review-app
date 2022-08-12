import { Input, Row, Col, Form, Button } from "antd";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
// import QuestionComponent from "../Form/QuestionComponent";
// import Link from "next/link";
// import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
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
      await fetch("/api/template", {
        method: "PUT",
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            router.push("/template");
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function addNewForm(obj) {
    await fetch("/api/template", {
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          router.push("/template");
          openNotificationBox("success", response.message, 3);
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => {
        console.log(err);
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
    <div className="mx-4">
      {/* <Row gutter={16}>
        <Col xs={24} md={8}>
          <div className="mb-2 px-1 template-title-input">
            <Input
              placeholder="Template Title"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
              className="input-box text-2xl template-title px-4 py-3"
              bordered={false}
              maxLength={180}
            />
          </div>
          <div className="w-full bg-white rounded-xl shadow-md  mt-4 add-template-wrapper sider-question-wrapper overflow-auto">
            <div className="rounded-t-md  mt-1">
              <div className="question-section-container">
                <div className="question-section-contents">
                  <div className="question-section-contents-card">
                    {questions?.length > 0 &&
                      questions?.map((question, idx) => (
                        <div
                          className={` question-section-wrapper my-1 px-4 py-3 cursor-pointer ${
                            idx == questions?.length - 1
                              ? null
                              : "border-bottom"
                          }`}
                          key={idx + "side que"}
                        >
                          <div className="flex justify-between">
                            <div className="w-full">
                              <div
                                className="flex items-center"
                                onClick={() => {
                                  setActiveQuestionIndex(idx);
                                  setSelectTypeFeild(false);
                                }}
                              >
                                <span className=" rounded-full linear-bg">
                                  {idx + 1}
                                </span>

                                <span className=" px-2 py-1 ">
                                  <span className="">
                                    {question?.questionText}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="">
                              <span
                                className=" dark-blue-bg cursor-pointer"
                                onClick={() => removeElement(idx)}
                              >
                                <CloseOutlined className="text-xs" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-between ">
            <button
              className=" px-1 md:px-4 py-3 h-full rounded primary-bg-btn text-white w-3/4 md:w-1/2 my-1 mr-1"
              type="button"
              onClick={() => {
                addMoreQuestionField();
              }}
            >
              <span className="MuiButton-label">Add New Question</span>
            </button>
            <Link href={"/template"}>
              <button
                className="py-3 h-full rounded toggle-btn-bg text-white  w-1/3  my-1"
                type="button"
              >
                <span className="MuiButton-label">Cancel</span>
              </button>
            </Link>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <div className="w-full bg-white rounded-xl shadow-md mt-4 add-template-wrapper">
            <div className="rounded-t-md  mt-1">
              {questions?.length > 0 &&
                questions
                  ?.filter((_, index) => index === activeQuestionIndex)
                  ?.map((question) => (
                    <QuestionComponent
                      {...question}
                      editMode={editMode}
                      idx={activeQuestionIndex}
                      removeElement={removeElement}
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
                      setSelectTypeFeild={setSelectTypeFeild}
                    />
                  ))}
            </div>
          </div>
          <div className="block lg:flex justify-end items-end my-4  lg:pl-56 ">
            <button
              className=" px-4 py-3 h-full rounded primary-bg-btn text-white  my-1 ml-2"
              type="button"
              onClick={() => {
                saveFormField();
              }}
            >
              <span className="MuiButton-label">Save </span>
            </button>
          </div>
        </Col>
      </Row> */}
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
          <Button key="add" type="primary" onClick={handleOk}>
            Create Template
          </Button>
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
    </div>
  );
}

export default TemplateBuildComponent;

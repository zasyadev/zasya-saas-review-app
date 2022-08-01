import { Input, Row, Col } from "antd";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
import QuestionComponent from "../Form/QuestionComponent";
import Link from "next/link";
import { CloseOutlined } from "@ant-design/icons";

const defaultQuestionConfig = {
  questionText: "Untitled Question",
  options: [{ optionText: "Option 1" }],
  open: true,
  type: "checkbox",
  error: "",
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

function TemplateBuildComponent({
  user,
  setFormDetailShow,
  editMode,
  editFormData,
  setEditMode,
  fetchFormList,
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState([defaultQuestionConfig]);
  const [formTitle, setFormTitle] = useState("");
  const [formDes, setFormDes] = useState("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  function removeElement(idx) {
    setQuestions((prev) => prev.filter((_, i) => i != idx));
    if (idx > -1) setActiveQuestionIndex(idx - 1);
  }

  function addMoreQuestionField() {
    // expandCloseAll();
    setQuestions((prev) => [...prev, defaultQuestionConfig]);
    setActiveQuestionIndex(questions.length);
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
      // {
      //   questions.filter((item, idx) =>
      //     item.questionText === "" ? setQuestions() : item
      //   );
      // }
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
    }
  }, []);

  return (
    <div className="mx-2">
      <Row gutter={16}>
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
                          className="question-section-wrapper my-1 px-4 py-3 cursor-pointer"
                          onClick={() => setActiveQuestionIndex(idx)}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <span className=" rounded-full linear-bg">
                                {idx + 1}
                              </span>

                              <span className=" px-2 py-1 ">
                                <span className="">
                                  <p>{question?.questionText}</p>
                                </span>
                              </span>
                            </div>
                            <div className="">
                              <span
                                className=" dark-blue-bg cursor-pointer"
                                onClick={() => removeElement(idx)}
                              >
                                <CloseOutlined />
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
              className=" px-1 md:px-4 py-3 h-full rounded primary-bg-btn text-white w-3/4 md:w-1/2 my-1"
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
                  ?.map((question, idx) => (
                    <>
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
                      />
                    </>
                  ))}
            </div>
          </div>
          <div className="block lg:flex justify-end items-end my-4  lg:pl-56 ">
            {/* <Link href={"/template"}>
              <button
                className=" toggle-btn-bg mr-2 px-4 py-3 h-full rounded  text-white  my-1"
                type="button"
              >
                <span className="MuiButton-label">Preview</span>
              </button>
            </Link> */}
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
      </Row>
      {/* <div className="w-full  md:w-4/6 mx-auto">
        <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4 add-template-wrapper">
          <div className="rounded-t-md  mt-1">
            <div className="w-full flex flex-col items-start  pt-2 pb-5 ">
              <Input
                placeholder="Template Title"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                }}
                className="input-box text-2xl template-title"
                bordered={false}
              />
              <Input
                placeholder="Template Description"
                value={formDes}
                onChange={(e) => {
                  setFormDes(e.target.value);
                }}
                className="input-box text-base mt-4 "
                bordered={false}
              />
            </div>
          </div>

          {questions?.length > 0 &&
            questions?.map((question, idx) => (
              <>
                <QuestionComponent
                  {...question}
                  editMode={editMode}
                  idx={idx}
                  removeElement={removeElement}
                  defineType={defineType}
                  showAsQuestion={showAsQuestion}
                  handleExpand={handleExpand}
                  addOption={addOption}
                  handleQuestionValue={handleQuestionValue}
                  handleOptionValue={handleOptionValue}
                  removeOption={removeOption}
                  handleScaleOptionValue={handleScaleOptionValue}
                />
              </>
            ))}

          <div className="block lg:flex justify-end items-end my-4  lg:pl-56 ">
            <button
              // className=" px-4 py-3 h-full rounded bg-cyan-500 text-white"
              className="primary-bg-btn text-white text-sm py-3 my-1  rounded h-full w-full"
              type="button"
              onClick={() => {
                addMoreQuestionField();
              }}
            >
           
              Add Question
          
            </button>
            <Link href={"/template"}>
              <button
                className="py-3 h-full rounded toggle-btn-bg text-white lg:mx-4 w-full  my-1"
                type="button"
              >
                <span className="MuiButton-label">Cancel</span>
              </button>
            </Link>
            <button
              className=" px-4 py-3 h-full rounded primary-bg-btn text-white w-full my-1"
              type="button"
              onClick={() => {
                saveFormField();
              }}
            >
              <span className="MuiButton-label">Save Template</span>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TemplateBuildComponent;

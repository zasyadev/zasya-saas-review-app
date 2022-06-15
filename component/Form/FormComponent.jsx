import { TextField } from "@material-ui/core";
import { Button } from "antd";
import React, { useState, useEffect } from "react";
import { openNotificationBox } from "../../helpers/notification";
import QuestionComponent from "./QuestionComponent";

function FormComponent({
  user,
  setFormDetailShow,
  formList,
  editMode,
  editFormData,
  setEditMode,
  fetchFormList,
}) {
  const defaultQuestionConfig = {
    questionText: "Question",
    options: [{ optionText: "Option 1" }],
    open: true,
    type: "checkbox",
  };
  const defaultScaleQuestion = {
    questionText: "Question",
    options: [{ optionText: "low" }, { optionText: "high" }],
    lowerLabel: 0,
    higherLabel: 5,
    open: true,
    type: "scale",
  };

  const [questions, setQuestions] = useState([defaultQuestionConfig]);
  const [formTitle, setFormTitle] = useState("");
  const [formDes, setFormDes] = useState("");

  function removeElement(idx) {
    setQuestions((prev) => prev.filter((item, i) => i != idx));
  }

  function addMoreQuestionField() {
    expandCloseAll();
    setQuestions((prev) => [...prev, defaultQuestionConfig]);
  }
  function defineType(type, index) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === index
          ? type === "scale"
            ? {
                ...defaultScaleQuestion,
              }
            : {
                ...defaultQuestionConfig,
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
  function expandCloseAll() {
    setQuestions((prev) =>
      prev.map((item) => (item ? { ...item, open: false } : item))
    );
  }

  function handleExpand(idx) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, open: true } : { ...item, open: false }
      )
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

  function handleQuestionValue(text, idx) {
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, questionText: text } : item
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
    setQuestions((prev) =>
      prev.map((item, i) =>
        i === idx
          ? type === "lowerLabel"
            ? {
                ...item,
                lowerLabel: text,
              }
            : {
                ...item,
                higherLabel: text,
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
              options: item.options.filter((option, jdx) => j != jdx),
            }
          : item
      )
    );
  }

  async function saveFormField() {
    let id = editFormData.id;
    if (formDes && formTitle) {
      let obj = {
        user_id: user.id,
        form_data: {
          title: formTitle,
          description: formDes,
          questions: questions,
        },
        form_title: formTitle,
        form_description: formDes,
        status: true,
        questions: questions,
      };
      editMode ? updateFormData(obj, id) : addNewForm(obj);
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
            openNotificationBox("success", response.message, 3);
            setFormDetailShow(false);
            setEditMode(false);
            fetchFormList();
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
          openNotificationBox("success", response.message, 3);
          setFormDetailShow(false);
          setEditMode(false);
          fetchFormList();
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
      setQuestions(editFormData?.questions);
      setFormTitle(editFormData?.title);
      setFormDes(editFormData?.description);
    }
  }, []);

  return (
    <div className="w-4/6 mx-auto">
      <div className="  border-t-8 rounded-t-md border-cyan-500 shadow-lg mt-4">
        <div>
          <div className="w-full flex flex-col items-start px-4 pt-4 pb-5 ">
            <div>
              <TextField
                fullWidth={true}
                placeholder="Form Tittle"
                multiline={true}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                }}
                value={formTitle}
                inputProps={{ style: { fontSize: 40, paddingTop: 10 } }}
              />
              <TextField
                fullWidth={true}
                placeholder="Description"
                multiline={true}
                onChange={(e) => {
                  setFormDes(e.target.value);
                }}
                value={formDes}
              />
            </div>
          </div>
        </div>
      </div>

      {questions?.length > 0 &&
        questions?.map((question, idx) => (
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
        ))}

      <div className="flex justify-center my-4">
        <Button
          className=" px-4 py-3 h-full rounded bg-cyan-500 text-white"
          type="button"
          onClick={() => {
            addMoreQuestionField();
          }}
        >
          <span className="MuiButton-label">
            Add Question
            <span className="MuiButton-endIcon MuiButton-iconSizeMedium">
              +
            </span>
          </span>
        </Button>
        <Button
          className=" px-4 py-3 h-full rounded bg-cyan-500 text-white mx-4"
          type="button"
          onClick={() => {
            saveFormField();
          }}
        >
          <span className="MuiButton-label">Save Template</span>
        </Button>
        <Button
          className=" px-4 py-3 h-full rounded bg-cyan-500 text-white "
          type="button"
          onClick={() => {
            setFormDetailShow(false);
            setEditMode(false);
          }}
        >
          <span className="MuiButton-label">Cancel</span>
        </Button>
      </div>
    </div>
  );
}

export default FormComponent;

import { CloseOutlined } from "@ant-design/icons";
import { Form, Skeleton } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import { FormSlideComponent } from "../Review/formhelper/FormSlideComponent";
import { SURVEY_TYPE } from "../Template/constants";

function SurveyReplyComponent({ urlId }) {
  const [answerForm] = Form.useForm();
  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [thankyouResponse, setThankyouResponse] = useState(false);
  const [inactiveResponse, setInactiveResponse] = useState({
    status: false,
    message: "Survey is not active",
  });
  const [updateAnswerApiLoading, setUpdateAnswerApiLoading] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [nextSlide, setNextSlide] = useState(0);

  const handleAnswerChange = (quesId, value, type) => {
    if (type === "input" && value.length > 179) {
      openNotificationBox(
        "error",
        "You can't write more than 180 character",
        3
      );
    }
    if (value && value.trim() && quesId) {
      setFormValues((prev) =>
        prev.find((item) => item.questionId === quesId)
          ? prev.map((item) =>
              item.questionId === quesId ? { ...item, answer: value } : item
            )
          : [...prev, { questionId: quesId, answer: value }]
      );
    }
  };

  const handleSubmit = async () => {
    if (formValues.length <= 0) {
      openNotificationBox("error", "You have to answer all question", 3);
      return;
    }
    if (questions.length != formValues.length) {
      openNotificationBox("error", "You have to answer all question", 3);
      return;
    }

    if (surveyData.id) {
      setUpdateAnswerApiLoading(true);

      let obj = {
        survey_id: surveyData.id,
        answerValue: formValues,
        created_survey_date: surveyData.created_date,
        urlId: urlId,
      };

      await httpService
        .post(`/api/survey/answer`, obj)
        .then(({ data: response }) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            setUpdateAnswerApiLoading(false);
            setThankyouResponse(true);
          }
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message, 3);
          setUpdateAnswerApiLoading(false);
        });
    }
  };

  const fetchSurveyData = async (urlId) => {
    setLoading(true);
    await httpService
      .post(`/api/survey/getSurveyByUrl`, {
        urlId: urlId,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setSurveyData(response.data);
          setQuestions(response.data?.SurveyQuestions);
        } else if (response.status === 403) {
          setInactiveResponse({
            status: true,
            message: response?.message,
          });
        } else if (response.status === 402) {
          setThankyouResponse(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
      });
  };

  useEffect(() => {
    if (urlId) fetchSurveyData(urlId);
  }, [urlId]);

  return (
    <div className="answer-bg px-2 py-4 md:p-4 flex items-center justify-center">
      {loading ? (
        <div className=" text-center bg-white rounded-md p-10 shadow-md md:w-10/12 2xl:w-8/12 mx-auto">
          <Skeleton title={false} active={true} className="mt-4" />
        </div>
      ) : (
        <Form layout="vertical" className="py-4 w-11/12" form={answerForm}>
          <AnimatePresence>
            {inactiveResponse.status ? (
              <div className="answer-preview">
                <motion.div
                  key={"inactivequesSlid"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="relative text-center bg-white rounded-md py-10 shadow-md md:w-10/12 2xl:w-8/12 mx-auto">
                    <Link href="/" passHref>
                      <span className="absolute top-2 right-2 p-3 leading-0 cursor-pointer rounded-full hover:bg-gray-100">
                        <CloseOutlined />
                      </span>
                    </Link>
                    <p className="text-lg font-bold text-red-400 my-2">
                      Sorry! the survey has been closed.
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : thankyouResponse ? (
              <div className="answer-preview">
                <motion.div
                  key={"thankyouquesSlid"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="relative text-center bg-white rounded-md py-10 shadow-md md:w-10/12 2xl:w-8/12 mx-auto">
                    <Link href="/" passHref>
                      <span className="absolute top-2 right-2 p-3 leading-0 cursor-pointer rounded-full hover:bg-gray-100">
                        <CloseOutlined />
                      </span>
                    </Link>
                    <p className="text-lg font-bold text-red-400 my-2">
                      ThankYou for your response! Have a nice day!
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              Number(questions?.length) > 0 &&
              questions
                ?.filter((_, index) => index === nextSlide)
                ?.map((question, idx) => (
                  <FormSlideComponent
                    key={idx + "quesSlid"}
                    type={question?.type}
                    id={question?.id}
                    questionText={question?.questionText}
                    options={question?.SurveyQuestionOption}
                    defaultQuestionAnswer={formValues?.find(
                      (values) => values.questionId === question?.id
                    )}
                    updateAnswerApiLoading={updateAnswerApiLoading}
                    nextSlide={nextSlide}
                    setNextSlide={setNextSlide}
                    totalQuestions={questions.length}
                    handleSubmit={handleSubmit}
                    handleAnswerChange={handleAnswerChange}
                    handleUpdateAnswer={() => {}}
                    fromType={SURVEY_TYPE}
                  />
                ))
            )}
          </AnimatePresence>
        </Form>
      )}
    </div>
  );
}

export default SurveyReplyComponent;

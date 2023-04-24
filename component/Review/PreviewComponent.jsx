import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import PreviewAnswer from "./formhelper/PreviewAnswer";

const defaultLoading = { questionLoading: false, answerLoading: false };

function PreviewComponent({ reviewId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(defaultLoading);

  const fetchAnswer = async () => {
    setLoading((prev) => ({ ...prev, answerLoading: true }));

    await httpService
      .get(`/api/review/answer/${reviewId}`)
      .then(({ data: response }) => {
        setAnswers(response.data.ReviewAssigneeAnswerOption);
        setLoading((prev) => ({ ...prev, answerLoading: false }));
      })
      .catch((err) => {
        setLoading((prev) => ({ ...prev, answerLoading: false }));
      });
  };

  const previewAnswer = (answers, questions) => {
    if (questions?.length > 0) {
      let feedBackArray = [];

      questions.forEach((questionitem) => {
        if (answers?.length > 0) {
          answers.filter((answerItem) => {
            if (answerItem.question_id === questionitem.id) {
              let obj = {
                questionText: questionitem.questionText,
                option: answerItem.option,
                type: questionitem.type,
              };
              feedBackArray.push(obj);
              return obj;
            }
          });
        }
      });
      if (feedBackArray.length) {
        setPreviewData(feedBackArray);
      }
    }
  };
  const fetchReviewData = async () => {
    setLoading((prev) => ({ ...prev, questionLoading: true }));
    await httpService
      .post(`/api/review/received/${reviewId}`, {})
      .then(({ data: response }) => {
        setQuestions(response.data?.review?.form?.questions);
        setReviewTitle(response.data?.review?.review_name);
        setLoading((prev) => ({ ...prev, questionLoading: false }));
      })
      .catch((err) => {
        setLoading((prev) => ({ ...prev, questionLoading: false }));
      });
  };

  useEffect(() => {
    if (reviewId) {
      fetchReviewData();
      fetchAnswer();
    }
  }, []);

  useEffect(() => {
    if (answers.length && questions.length) previewAnswer(answers, questions);
  }, [answers.length, questions.length]);

  return (
    <div className="preview-answer">
      {loading.questionLoading && loading.answerLoading ? (
        <div className="answer-bg  pt-8">
          <div className=" bg-white rounded-md shadow-md mx-auto w-2/3 p-5">
            <Skeleton active />
          </div>
        </div>
      ) : previewData.length > 0 ? (
        <PreviewAnswer
          length={previewData.length}
          formTitle={reviewTitle}
          questions={previewData}
        />
      ) : (
        <div className="answer-bg  pt-8">
          <div className=" bg-white rounded-md shadow-md mx-auto w-2/3 ">
            <p className="p-5 ">This review is not found</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default PreviewComponent;

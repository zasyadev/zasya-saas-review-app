import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";

import { PreviewAnswer } from "./formhelper/PreviewAnswer";
function PreviewComponent({ user, reviewId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [nextSlide, setNextSlide] = useState(0);

  const fetchAnswer = async () => {
    if (reviewId) {
      await httpService
        .post(`/api/review/answer/id/${reviewId}`, {
          userId: user.id,
        })
        .then(({ data: response }) => {
          setAnswers(response.data[0].ReviewAssigneeAnswerOption);
        })
        .catch((err) => {
          console.error(err.response.data.message);
        });
    }
  };

  const previewAnswer = (answers, questions) => {
    if (questions?.length > 0) {
      let feedBackArray = [];

      let filterData = questions.map((questionitem) => {
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
  const fetchReviewData = async (user, reviewId) => {
    await httpService
      .post(`/api/review/received/${reviewId}`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setQuestions(response.data?.review?.form?.questions);
        }
      })
      .catch((err) => {
        console.error(err.response.data.message);
      });
  };

  useEffect(() => {
    if (reviewId) {
      fetchReviewData(user, reviewId);

      fetchAnswer();
    }
  }, []);

  useEffect(() => {
    if (answers.length && questions.length) previewAnswer(answers, questions);
  }, [answers.length, questions.length]);

  return (
    <div className="preview-answer">
      {previewData.length > 0 &&
        previewData
          ?.filter((_, index) => index === nextSlide)
          ?.map((item) => (
            <>
              <PreviewAnswer
                item={item}
                nextSlide={nextSlide}
                setNextSlide={setNextSlide}
                length={previewData.length}
              />
            </>
          ))}
    </div>
  );
}
export default PreviewComponent;

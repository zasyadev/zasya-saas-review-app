import React, { useEffect, useState } from "react";

import { PreviewAnswer } from "./formhelper/PreviewAnswer";
function PreviewComponent({ user, reviewId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [nextSlide, setNextSlide] = useState(0);

  const fetchAnswer = async () => {
    if (user && reviewId) {
      await fetch("/api/review/answer/id/" + reviewId, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          setAnswers(response.data[0].ReviewAssigneeAnswerOption);
        })
        .catch((err) => {
          console.log(err);
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
              let obj = { ...questionitem, ...answerItem };
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
    await fetch("/api/review/received/" + reviewId, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setQuestions(response?.data?.review?.form?.questions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user && reviewId) {
      fetchReviewData(user, reviewId);

      fetchAnswer();
    } else return;
  }, []);

  useEffect(() => {
    if (previewAnswer.length) previewAnswer(answers, questions);
  }, [answers, questions]);

  return (
    <>
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
    </>
  );
}
export default PreviewComponent;

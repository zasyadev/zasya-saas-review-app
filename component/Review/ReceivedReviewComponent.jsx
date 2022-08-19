import { Form, Skeleton } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";

import { FormSlideComponent } from "./formhelper/FormComponent";
import httpService from "../../lib/httpService";

function ReceivedReviewComponent({ user, reviewId }) {
  const router = useRouter();
  const [answerForm] = Form.useForm();
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);
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

    if (user.id && reviewData.id) {
      let ansValues = formValues.sort((a, b) => a.questionId - b.questionId);
      let obj = {
        user_id: user.id,
        review_assignee_id: reviewData.id,
        answers: ansValues,
        review_id: reviewData.review.id,
        created_assignee_date: reviewData.created_date,
      };

      await httpService
        .post(`/api/form/answer`, obj)
        .then(({ data: response }) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            router.replace("/review/received");
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchReviewData = async (user, reviewId) => {
    setLoading(true);

    await fetch("/api/review/received/" + reviewId, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
    });
    await httpService
      .post(`/api/review/received/${reviewId}`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setReviewData(response.data);
          setQuestions(response.data?.review?.form?.questions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (reviewId) fetchReviewData(user, reviewId);
    else return;
  }, []);

  return (
    <div className="answer-bg p-4">
      {loading ? (
        <Skeleton
          title={false}
          active={true}
          width={[200]}
          className="mt-4"
          rows={3}
        />
      ) : (
        <>
          <div className="text-right mt-4 mr-4">
            <Link href="/review/received">
              <button className="primary-bg-btn text-white py-2 px-4 rounded-md">
                Back
              </button>
            </Link>
          </div>
          <Form layout="vertical" className="py-4" form={answerForm}>
            {questions.length > 0 &&
              questions
                ?.filter((_, index) => index === nextSlide)
                ?.map((question, idx) => (
                  <FormSlideComponent
                    {...question}
                    idx={idx}
                    open={false}
                    nextSlide={nextSlide}
                    handleAnswerChange={handleAnswerChange}
                    setNextSlide={setNextSlide}
                    length={questions.length}
                    handleSubmit={handleSubmit}
                  />
                ))}
          </Form>
        </>
      )}
    </div>
  );
}

export default ReceivedReviewComponent;

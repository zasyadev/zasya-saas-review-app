import { CloseOutlined } from "@ant-design/icons";
import { Form, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import { FormSlideComponent } from "./formhelper/FormSlideComponent";
import { motion, AnimatePresence } from "framer-motion";

function ReceivedReviewComponent({ user, reviewId }) {
  const router = useRouter();
  const [answerForm] = Form.useForm();
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSpin, setLoadingSpin] = useState(false);
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
    setLoadingSpin(true);
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
          }
          // setLoadingSpin(false);
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message, 3);
          console.error(err.response.data?.message);
          setLoadingSpin(false);
        });
    }
  };

  const fetchReviewData = async (user, reviewId) => {
    setLoading(true);

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
        openNotificationBox("error", err.response.data?.message);
      });
  };

  useEffect(() => {
    if (reviewId) fetchReviewData(user, reviewId);
  }, []);

  return (
    <div className="answer-bg px-2 py-4 md:p-4 flex items-center justify-center">
      {loading ? (
        <div className=" text-center bg-white rounded-md p-10 shadow-md md:w-10/12 2xl:w-8/12 mx-auto">
          <Skeleton title={false} active={true} className="mt-4" />
        </div>
      ) : reviewData?.status ? (
        <div className="relative  text-center bg-white rounded-md py-10 shadow-md md:w-10/12 2xl:w-8/12 mx-auto">
          <Link href="/review/received" passHref>
            <span className="absolute top-2 right-2 p-3 leading-0 cursor-pointer rounded-full hover:bg-gray-100">
              <CloseOutlined />
            </span>
          </Link>
          <p className="text-lg font-bold text-red-400 mt-5">
            Already Submitted This Review
          </p>
        </div>
      ) : (
        <Form layout="vertical" className="py-4 w-11/12" form={answerForm}>
          <AnimatePresence>
            {Number(questions?.length) > 0 ? (
              questions
                ?.filter((_, index) => index === nextSlide)
                ?.map((question, idx) => (
                  <FormSlideComponent
                    {...question}
                    idx={idx}
                    key={idx + "quesSlid"}
                    open={false}
                    nextSlide={nextSlide}
                    handleAnswerChange={handleAnswerChange}
                    setNextSlide={setNextSlide}
                    length={questions.length}
                    handleSubmit={handleSubmit}
                    loadingSpin={loadingSpin}
                  />
                ))
            ) : (
              <>
                <div className="answer-preview">
                  <motion.div
                    key={"loaderquesSlid"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="relative text-center bg-white rounded-md py-10 shadow-md md:w-10/12 2xl:w-8/12 mx-auto">
                      <Link href="/review/received" passHref>
                        <span className="absolute top-2 right-2 p-3 leading-0 cursor-pointer rounded-full hover:bg-gray-100">
                          <CloseOutlined />
                        </span>
                      </Link>
                      <p className="text-lg font-bold text-red-400 mt-5">
                        Review Not Found
                      </p>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </Form>
      )}
    </div>
  );
}

export default ReceivedReviewComponent;

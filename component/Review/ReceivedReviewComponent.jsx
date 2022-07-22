import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { openNotificationBox } from "../../helpers/notification";
import QuestionViewComponent from "../Form/QuestionViewComponent";
// import {
//   InputComponent,
//   OptionComponent,
//   TextAreaComponent,
//   SliderComponent,
// } from "./formhelper/FormComponent";

function ReceivedReviewComponent({ user, reviewId }) {
  const router = useRouter();
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const [questions, setQuestions] = useState([]);

  const handleAnswerChange = (quesId, value) => {
    setFormValues((prev) =>
      prev.find((item) => item.questionId === quesId)
        ? prev.map((item) =>
            item.questionId === quesId ? { ...item, answer: value } : item
          )
        : [...prev, { questionId: quesId, answer: value }]
    );

    // setQuestions((prev) =>
    //   prev.find((item) => item.id === quesId && item.error)
    //     ? prev.map((item) =>
    //         item.id === quesId && item.error ? { ...item, error: "" } : item
    //       )
    //     : prev
    // );
  };

  const handleSubmit = async () => {
    if (formValues.length <= 0) {
      openNotificationBox("error", "You have to answer all question", 3);
      return;
    }
    if (questions.length != formValues.length) {
      openNotificationBox("error", "You have to answer all question", 3);
      // setQuestions((prev) =>
      //   prev.map((queItem) => {
      //     let errorAnswer;
      //     formValues.forEach((ansItem, idx) => {
      //       errorAnswer =
      //         ansItem.questionId == queItem.id
      //           ? queItem
      //           : { ...queItem, error: "Answer field required!" };
      //     });

      //     return errorAnswer;
      //   })
      // );
      return;
    }

    if (user.id && reviewData.id) {
      let obj = {
        user_id: user.id,
        review_assignee_id: reviewData.id,
        answers: formValues,
        review_id: reviewData.review.id,
        created_assignee_date: reviewData.created_date,
      };

      await fetch("/api/form/answer", {
        method: "POST",
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            router.push("/review/received");
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
    // setFormAssignList([]);
    await fetch("/api/review/received/" + reviewId, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setReviewData(response.data);
          setQuestions(response?.data?.review?.form?.questions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function handleCancel() {
    router.push("/review");
  }

  useEffect(() => {
    if (user && reviewId) fetchReviewData(user, reviewId);
    else return;
  }, []);

  return (
    <div className="px-3 md:px-8 h-auto mt-5">
      <div className="container mx-auto max-w-full">
        <div className="grid grid-cols-1 px-4 mb-16">
          <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 h-full ">
            <div className="p-4 ">
              <div className="overflow-x-auto">
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
                    <div className="w-full flex  flex-col items-start px-4 pt-4 pb-5 bg-gray-200 rounded">
                      <div>
                        <h3 className="text-2xl font-medium primary-color-blue mb-2">
                          {reviewData?.review?.form?.form_title}
                        </h3>
                        <p className="text-base  font-normal text-black mb-2">
                          {reviewData?.review?.form?.form_description}
                        </p>
                      </div>
                    </div>

                    {questions.length > 0 &&
                      questions?.map((question, idx) => (
                        <>
                          <QuestionViewComponent
                            {...question}
                            idx={idx}
                            open={false}
                            handleAnswerChange={handleAnswerChange}
                          />
                        </>
                      ))}

                    <div className="flex justify-end mt-4">
                      <button
                        key="add"
                        className="profile-submit-button py-2 cursor-pointer primary-bg-btn text-white text-base  text-center rounded-md h-full w-32 mr-2"
                        type="primary"
                        onClick={() => handleCancel()}
                      >
                        Cancel
                      </button>
                      <button
                        key="add"
                        className="profile-submit-button py-2 cursor-pointer primary-bg-btn text-white text-base  text-center rounded-md h-full w-32"
                        type="primary"
                        onClick={() => handleSubmit()}
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceivedReviewComponent;

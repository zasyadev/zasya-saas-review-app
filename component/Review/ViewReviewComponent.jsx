import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import AdminLayout from "../layout/AdminLayout";
import ReviewCreatedComponent from "./ReviewCreatedComponent";

function ViewReviewComponent({ user }) {
  const router = useRouter();
  const { review_id } = router.query;
  const [reviewData, setReviewData] = useState({
    questionData: {},
    answerData: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchReviewData = async (reviewId) => {
    setLoading(true);
    setReviewData({});

    await httpService
      .post(`/api/review/get_que_ans`, {
        review_id: reviewId,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setReviewData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (review_id) fetchReviewData(review_id);
  }, [review_id]);

  return (
    <AdminLayout
      user={user}
      isBack
      title={reviewData?.questionData?.review_name}
    >
      {loading ? (
        <div className="container bg-white rounded-md p-5 mx-auto max-w-full">
          <Skeleton active />
        </div>
      ) : reviewData &&
        reviewData?.questionData &&
        typeof reviewData.questionData === "object" ? (
        Object.keys(reviewData.questionData).length ? (
          <ReviewCreatedComponent
            user={user}
            reviewData={reviewData.questionData}
            reviewId={review_id}
            fetchReviewData={fetchReviewData}
            answerData={reviewData.answerData}
          />
        ) : null
      ) : null}
    </AdminLayout>
  );
}

export default ViewReviewComponent;

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import AdminLayout from "../layout/AdminLayout";
import ReviewCreatedComponent from "./ReviewCreatedComponent";

function ViewReviewComponent({ user }) {
  const router = useRouter();
  const { review_id } = router.query;
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchReviewData = async (user, reviewId) => {
    setLoading(true);
    setReviewData({});

    await httpService
      .post(`/api/review/created/${reviewId}`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setReviewData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (review_id) fetchReviewData(user, review_id);
    else return;
  }, []);
  return (
    <AdminLayout user={user} title={reviewData?.review_name}>
      {loading ? (
        <div className="container mx-auto max-w-full">
          <div className="border shadow bg-white rounded-md p-2 mt-4 w-full mx-auto">
            <div className="w-full  rounded-xl  p-2 mt-2 template-wrapper">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : reviewData ? (
        Object.keys(reviewData).length ? (
          <ReviewCreatedComponent
            user={user}
            reviewData={reviewData}
            reviewId={review_id}
            fetchReviewData={fetchReviewData}
          />
        ) : null
      ) : null}
    </AdminLayout>
  );
}

export default ViewReviewComponent;

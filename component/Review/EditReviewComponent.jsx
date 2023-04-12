import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddEditReviewComponent from "../../component/Review/AddEditReviewComponent";
import httpService from "../../lib/httpService";
import { HeadersComponent } from "../common/HeadersComponent";
import { PulseLoader } from "../Loader/LoadingSpinner";

function EditReviewComponent({ user }) {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { review_id } = router.query;

  const fetchReviewData = async (review_id) => {
    setLoading(true);
    setReviewData(null);

    await httpService
      .post(`/api/template/view`, {
        template_id: review_id,
      })
      .then(({ data: response }) => {
        setReviewData(response.data);
      })
      .catch(() => setReviewData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (review_id) fetchReviewData(review_id);
  }, []);

  return (
    <>
      <HeadersComponent />
      {loading ? (
        <div className="container mx-auto max-w-full">
          <PulseLoader />
        </div>
      ) : (
        <AddEditReviewComponent
          user={user}
          reviewPreviewData={reviewData}
          previewForm={true}
          reviewId={review_id}
          pageTitle="Edit Review"
        />
      )}
    </>
  );
}

export default EditReviewComponent;

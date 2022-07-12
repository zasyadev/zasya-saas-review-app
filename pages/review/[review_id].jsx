import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import ReviewCreatedComponent from "../../component/Review/ReviewCreatedComponent";

function ReviewCreated({ user }) {
  const router = useRouter();
  const { review_id } = router.query;
  const [reviewData, setReviewData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchReviewData = async (user, reviewId) => {
    setLoading(true);
    setReviewData({});
    await fetch("/api/review/created/" + reviewId, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setReviewData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user && review_id) fetchReviewData(user, review_id);
    else return;
  }, []);

  return (
    <AdminLayout user={user} title={reviewData?.review_name}>
      {loading ? (
        "Loading"
      ) : Object.keys(reviewData).length ? (
        <ReviewCreatedComponent user={user} reviewData={reviewData} />
      ) : null}
      {/* {reviewData ? (
        <ReviewCreatedComponent user={user} reviewData={reviewData} />
      ) : null} */}
    </AdminLayout>
  );
}

export default ReviewCreated;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}

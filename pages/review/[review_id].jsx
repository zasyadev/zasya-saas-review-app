import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import ReviewCreatedComponent from "../../component/Review/ReviewCreatedComponent";
import httpService from "../../lib/httpService";

function ReviewCreated({ user }) {
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
        console.log(err);
      });
  };

  useEffect(() => {
    if (review_id) fetchReviewData(user, review_id);
    else return;
  }, []);

  return (
    <AdminLayout user={user} title={reviewData?.review_name}>
      {loading ? (
        <>
          <div className="px-3 md:px-8 h-auto mt-5">
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
          </div>
        </>
      ) : Object.keys(reviewData).length ? (
        <ReviewCreatedComponent
          user={user}
          reviewData={reviewData}
          reviewId={review_id}
          fetchReviewData={fetchReviewData}
        />
      ) : null}
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

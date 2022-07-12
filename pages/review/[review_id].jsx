import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import ReviewCreatedComponent from "../../component/Review/ReviewCreatedComponent";
import { Col, Row } from "antd";

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
        <>
          <div className="px-3 md:px-8 h-auto mt-5">
            <div className="container mx-auto max-w-full">
              {/* <Row gutter={[16, 16]}>
                <Col xs={24} md={16}> */}
              <div class="border shadow bg-white rounded-md p-2 mt-4 w-full mx-auto">
                <div className="w-full  rounded-xl  p-2 mt-2 template-wrapper">
                  <div class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-4 bg-slate-200 rounded"></div>
                      <div class="h-4 bg-slate-200 rounded"></div>

                      <div class="space-y-5">
                        <div class="grid grid-cols-2 gap-4">
                          <div class="h-4 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* </Col>
                <Col xs={24} md={8}> */}
              {/* <div class="border shadow bg-white rounded-md p-2 mt-4 w-full   mx-auto">
                    <div className="w-full  rounded-xl  p-2 mt-2 template-wrapper">
                      <div class="animate-pulse flex space-x-4">
                        <div class="flex-1 space-y-6 py-1">
                          <div class="h-4 bg-slate-200 rounded"></div>
                          <div class="h-4 bg-slate-200 rounded"></div>

                          <div class="space-y-5">
                            <div class="grid grid-cols-2 gap-4">
                              <div class="h-4 bg-slate-200 rounded"></div>
                              <div class="h-4 bg-slate-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
              {/* </Col>
              </Row> */}
            </div>
          </div>
        </>
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

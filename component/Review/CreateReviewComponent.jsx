import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../layout/AdminLayout";
import ReviewCreatedComponent from "./ReviewCreatedComponent";
import { Col, Row } from "antd";
import httpService from "../../lib/httpService";

function CreateReviewComponent({ user }) {
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
        setLoading(false);
        console.error(err.response.data.message);
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
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
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
                </Col>
                <Col xs={24} md={8}>
                  <div className="border shadow bg-white rounded-md p-2 mt-4 w-full   mx-auto">
                    <div className="w-full  rounded-xl  p-2 mt-2 template-wrapper">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-6 py-1">
                          <div className="h-4 bg-slate-200 rounded"></div>
                          <div className="h-4 bg-slate-200 rounded"></div>

                          <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="h-4 bg-slate-200 rounded"></div>
                              <div className="h-4 bg-slate-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </>
      ) : reviewData ? (
        Object.keys(reviewData).length ? (
          <ReviewCreatedComponent user={user} reviewData={reviewData} />
        ) : (
          <p className="p-5">No review Found</p>
        )
      ) : (
        <p className="p-5">No review Found</p>
      )}
    </AdminLayout>
  );
}

export default CreateReviewComponent;

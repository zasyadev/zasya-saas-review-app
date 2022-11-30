import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { HeadersComponent } from "../common/HeadersComponent";
import AddEditSurveyComponent from "./AddEditSurveyComponent";

function EditReviewComponent({ user }) {
  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { template_id } = router.query;

  const fetchReviewData = async (template_id) => {
    setLoading(true);
    setSurveyData({});

    await httpService
      .post(`/api/template/view`, {
        template_id: template_id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setSurveyData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (template_id) fetchReviewData(template_id);
  }, []);

  return (
    <>
      <HeadersComponent />
      {loading ? (
        <div className="container mx-auto max-w-full">
          <div className="border shadow bg-white rounded-md p-2 mt-4 w-full mx-auto">
            <div className="w-full  rounded-md  p-2 mt-2 template-wrapper">
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
      ) : (
        <AddEditSurveyComponent
          user={user}
          surveyPreviewData={surveyData}
          previewForm={true}
          pageTitle="Edit Survey"
        />
      )}
    </>
  );
}

export default EditReviewComponent;

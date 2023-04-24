import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { HeadersComponent } from "../common/HeadersComponent";
import { PulseLoader } from "../Loader/LoadingSpinner";
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
        setSurveyData(response.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (template_id) fetchReviewData(template_id);
  }, []);

  return (
    <>
      <HeadersComponent />
      {loading ? (
        <div className="container mx-auto max-w-full">
          <PulseLoader />
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

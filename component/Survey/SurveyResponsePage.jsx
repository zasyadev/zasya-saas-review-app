import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import AdminLayout from "../layout/AdminLayout";
import SurveyResponseComponent from "./SurveyResponseComponent";

function SurveyResponsePage({ user }) {
  const router = useRouter();
  const { surveyId } = router.query;
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSurveyData = async (surveyId) => {
    setLoading(true);
    setSurveyData(null);

    await httpService
      .post(`/api/survey/get_que_ans`, {
        surveyId: surveyId,
      })
      .then(({ data: response }) => {
        setSurveyData(response.data);
      })
      .catch(() => setSurveyData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (surveyId) fetchSurveyData(surveyId);
  }, [surveyId]);

  return (
    <AdminLayout user={user} isBack title={surveyData?.survey_name}>
      {loading ? (
        <div className="container bg-white rounded-md p-5 mx-auto max-w-full">
          <Skeleton active />
        </div>
      ) : surveyData.SurveyQuestions.length > 0 ? (
        <SurveyResponseComponent
          user={user}
          surveyName={surveyData.survey_name}
          surveyId={surveyData.surveyId}
          surveyQuestions={surveyData.SurveyQuestions}
          surveyAnswers={surveyData.SurveyAnswers}
          fetchSurveyData={fetchSurveyData}
        />
      ) : (
        <NoRecordFound />
      )}
    </AdminLayout>
  );
}

export default SurveyResponsePage;

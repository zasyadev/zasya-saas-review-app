import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import AdminLayout from "../layout/AdminLayout";
import SurveyCreatedComponent from "./SurveyCreatedComponent";
import { SURVEY_TYPE } from "../Template/constants";

function ViewSurveyDetailComponent({ user }) {
  const router = useRouter();
  const { surveyId } = router.query;

  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSurveyData = async (surveyId) => {
    setLoading(true);
    setSurveyData({});

    await httpService
      .post(`/api/survey/get_que_ans`, {
        surveyId: surveyId,
        user_id: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setSurveyData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
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
      ) : surveyData &&
        surveyData?.questionData &&
        typeof surveyData.questionData === "object" ? (
        Object.keys(surveyData.questionData).length ? (
          <SurveyCreatedComponent
            user={user}
            surveyData={surveyData}
            surveyId={surveyId}
            fetchSurveyData={fetchSurveyData}
            fromType={SURVEY_TYPE}
          />
        ) : null
      ) : (
        <NoRecordFound />
      )}
    </AdminLayout>
  );
}

export default ViewSurveyDetailComponent;

import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { PulseLoader } from "../Loader/LoadingSpinner";
import { TemplatePreviewComponent } from "../Template/TemplatePreviewComponent";

function SurveyQuestionPreviewWrapper({ surveyId }) {
  const [question, setQuestions] = useState(null);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSurveyData = async () => {
    setLoading(true);
    await httpService
      .post(`/api/survey/get_que_ans`, {
        surveyId: surveyId,
      })
      .then(({ data: response }) => {
        let filterQuestion = response.data?.SurveyQuestions.map((item) => {
          return {
            ...item,
            options: item.SurveyQuestionOption,
          };
        });
        setQuestions(filterQuestion);
        setSurveyTitle(response.data?.survey_name);
      })
      .catch(() => setQuestions(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSurveyData();
  }, [surveyId]);

  return loading ? (
    <PulseLoader isDouble />
  ) : (
    <TemplatePreviewComponent
      length={question.length}
      formTitle={surveyTitle}
      questions={question}
      isQuestionPreviewMode={true}
    />
  );
}

export default SurveyQuestionPreviewWrapper;

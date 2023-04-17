import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { PulseLoader } from "../Loader/LoadingSpinner";
import { TemplatePreviewComponent } from "../Template/TemplatePreviewComponent";

function ReviewQuestionPreviewWrapper({ reviewId }) {
  const [question, setQuestions] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviewData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/review/received/${reviewId}`)
      .then(({ data: response }) => {
        setQuestions(response.data?.form?.questions);
        setReviewTitle(response.data?.form?.form_title);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviewData();
  }, [reviewId]);

  return loading ? (
    <PulseLoader isDouble />
  ) : (
    <TemplatePreviewComponent
      length={question.length}
      formTitle={reviewTitle}
      questions={question}
      isQuestionPreviewMode={true}
    />
  );
}

export default ReviewQuestionPreviewWrapper;

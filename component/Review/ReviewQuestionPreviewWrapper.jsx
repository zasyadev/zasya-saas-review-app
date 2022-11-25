import React, { useEffect, useState } from "react";
import NoRecordFound from "../common/NoRecordFound";
import httpService from "../../lib/httpService";
import { TemplatePreviewComponent } from "../Template/TemplatePreviewComponent";

function ReviewQuestionPreviewWrapper({ user, reviewId }) {
  const [question, setQuestions] = useState({});
  const [reviewTitle, setReviewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviewData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/review/received/${reviewId}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setQuestions(response.data?.form?.questions);
          setReviewTitle(response.data?.form?.form_title);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviewData();
  }, [reviewId]);

  return loading ? (
    <div className="border shadow bg-white rounded-md p-2 mt-4 w-full  md:w-4/6 mx-auto">
      <div className="w-full  rounded-md  p-2 mt-2 template-wrapper">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

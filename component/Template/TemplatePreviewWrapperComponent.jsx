import React, { useEffect, useState } from "react";
import NoRecordFound from "../common/NoRecordFound";
import { TemplatePreviewComponent } from "./TemplatePreviewComponent";
import { useRouter } from "next/router";
import httpService from "../../lib/httpService";
import { REVIEW_TYPE } from "./constants";

function TemplatePreviewWrapperComponent() {
  const router = useRouter();
  const { template_id, type } = router.query;
  const [templateData, setTemplateData] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchTemplateData() {
    setLoading(true);
    setTemplateData({});

    await httpService
      .post(`/api/template/edit`, {
        template_id: template_id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setTemplateData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTemplateData({});
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchTemplateData();
  }, [template_id]);

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
  ) : templateData?.form_data?.questions?.length ? (
    <TemplatePreviewComponent
      length={templateData.form_data.questions.length}
      formTitle={templateData.form_data.title}
      questions={templateData.form_data.questions}
      isQuestionPreviewMode={true}
      templateId={template_id}
      linkHref={`/${
        type === REVIEW_TYPE ? "review" : "survey"
      }/edit/${template_id}`}
    />
  ) : (
    <NoRecordFound />
  );
}

export default TemplatePreviewWrapperComponent;

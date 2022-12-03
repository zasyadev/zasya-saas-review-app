import React, { useEffect, useState } from "react";
import NoRecordFound from "../common/NoRecordFound";
import { TemplatePreviewComponent } from "./TemplatePreviewComponent";
import { useRouter } from "next/router";
import httpService from "../../lib/httpService";
import { REVIEW_TYPE } from "./constants";
import { PulseLoader } from "../Loader/LoadingSpinner";

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
    <PulseLoader isDouble />
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

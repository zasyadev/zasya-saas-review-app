import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";

const SurveyReplyComponent = dynamic(
  () => import("../../component/Survey/SurveyReplyComponent"),
  {
    suspense: true,
  }
);
function SurveyReplyPage() {
  const router = useRouter();
  const { url_id } = router.query;
  return (
    <SuspenceWrapper>
      <HeadersComponent />
      <SurveyReplyComponent surveyId={url_id} />
    </SuspenceWrapper>
  );
}

export default SurveyReplyPage;

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import WithMe from "../../component/layout/WithMe";

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
      <WithMe>
        {({ user }) => (
          <>
            <HeadersComponent />
            <SurveyReplyComponent user={user} surveyId={url_id} />
          </>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default SurveyReplyPage;

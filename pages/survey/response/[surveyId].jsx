import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const SurveyResponsePage = dynamic(
  () => import("../../../component/Survey/SurveyResponsePage"),
  {
    suspense: true,
  }
);

function SurveyResponse() {
  return (
    <SuspenceWrapper>
      <WithMe>{({ user }) => <SurveyResponsePage user={user} />}</WithMe>
    </SuspenceWrapper>
  );
}

export default SurveyResponse;

import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const SurveyShareComponent = dynamic(
  () => import("../../../component/Survey/SurveyShareComponent"),
  {
    suspense: true,
  }
);

function SurveySharePage() {
  return (
    <SuspenceWrapper>
      <WithMe>{({ user }) => <SurveyShareComponent user={user} />}</WithMe>
    </SuspenceWrapper>
  );
}

export default SurveySharePage;

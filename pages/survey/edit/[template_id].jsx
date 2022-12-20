import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const EditSurveyComponent = dynamic(
  () => import("../../../component/Survey/EditSurveyComponent"),
  {
    suspense: true,
  }
);

function SurveyEdit() {
  return (
    <SuspenceWrapper>
      <WithMe>{({ user }) => <EditSurveyComponent user={user} />}</WithMe>
    </SuspenceWrapper>
  );
}

export default SurveyEdit;

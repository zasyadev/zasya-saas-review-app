import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const ViewSurveyDetailComponent = dynamic(
  () => import("../../../component/Survey/ViewSurveyDetailComponent"),
  {
    suspense: true,
  }
);

function SingleSurveyPage() {
  return (
    <SuspenceWrapper>
      <WithMe>{({ user }) => <ViewSurveyDetailComponent user={user} />}</WithMe>
    </SuspenceWrapper>
  );
}

export default SingleSurveyPage;

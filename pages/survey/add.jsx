import dynamic from "next/dynamic";
import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import WithMe from "../../component/layout/WithMe";

const AddEditSurveyComponent = dynamic(
  () => import("../../component/Survey/AddEditSurveyComponent"),
  {
    suspense: true,
  }
);

function SurveyAdd() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <>
            <HeadersComponent />
            <AddEditSurveyComponent user={user} pageTitle="Create Survey" />
          </>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default SurveyAdd;

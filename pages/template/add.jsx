import dynamic from "next/dynamic";
import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import WithMe from "../../component/layout/WithMe";

const TemplateBuildComponent = dynamic(
  () => import("../../component/Template/TemplateBuildComponent"),
  {
    suspense: true,
  }
);

function AddTemplate() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <>
            <HeadersComponent />
            <TemplateBuildComponent user={user} />
          </>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default AddTemplate;

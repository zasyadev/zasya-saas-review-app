import dynamic from "next/dynamic";
import React from "react";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const EditTemplateComponent = dynamic(
  () => import("../../../component/Template/EditTemplateComponent"),
  {
    suspense: true,
  }
);

function EditTemplate() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <>
            <HeadersComponent />
            <EditTemplateComponent user={user} />
          </>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default EditTemplate;

import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

const TemplatePreviewWrapperComponent = dynamic(
  () => import("../../../component/Template/TemplatePreviewWrapperComponent"),
  {
    suspense: true,
  }
);

function TemplatePreviewPage() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={""} isBack>
            <TemplatePreviewWrapperComponent user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default TemplatePreviewPage;

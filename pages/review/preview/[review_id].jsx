import React from "react";
import { useRouter } from "next/router";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import PreviewComponent from "../../../component/Review/PreviewComponent";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

function PreviewPage() {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <WithMe>
      {({ user }) => (
        <>
          <HeadersComponent />
          <AdminLayout user={user} title="Preview Answer" isBack>
            <PreviewComponent reviewId={review_id} />
          </AdminLayout>
        </>
      )}
    </WithMe>
  );
}

export default PreviewPage;

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import SuspenceWrapper from "../../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../../component/layout/AdminLayout";
import WithMe from "../../../../component/layout/WithMe";

const ReviewQuestionPreviewWrapper = dynamic(
  () => import("../../../../component/review/ReviewQuestionPreviewWrapper"),
  {
    suspense: true,
  }
);

function PreviewQuestionPage() {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <>
            <AdminLayout user={user} title="Preview questions" isBack>
              <ReviewQuestionPreviewWrapper user={user} reviewId={review_id} />
            </AdminLayout>
          </>
        )}
      </WithMe>{" "}
    </SuspenceWrapper>
  );
}

export default PreviewQuestionPage;

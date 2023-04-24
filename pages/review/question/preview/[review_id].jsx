import { useRouter } from "next/router";
import React from "react";
import AdminLayout from "../../../../component/layout/AdminLayout";
import WithMe from "../../../../component/layout/WithMe";
import ReviewQuestionPreviewWrapper from "../../../../component/Review/ReviewQuestionPreviewWrapper";

function PreviewQuestionPage() {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <WithMe>
      {({ user }) => (
        <>
          <AdminLayout user={user} title="Preview questions" isBack>
            <ReviewQuestionPreviewWrapper user={user} reviewId={review_id} />
          </AdminLayout>
        </>
      )}
    </WithMe>
  );
}

export default PreviewQuestionPage;

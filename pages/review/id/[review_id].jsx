import React from "react";
import { useRouter } from "next/router";
import ReceivedReviewComponent from "../../../component/Review/ReceivedReviewComponent";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import WithMe from "../../../component/layout/WithMe";

function ReceivedPage() {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <WithMe>
      {({ user }) => (
        <>
          <HeadersComponent />
          <ReceivedReviewComponent user={user} reviewId={review_id} />
        </>
      )}
    </WithMe>
  );
}

export default ReceivedPage;

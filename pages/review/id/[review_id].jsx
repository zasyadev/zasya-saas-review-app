import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const ReceivedReviewComponent = dynamic(
  () => import("../../../component/Review/ReceivedReviewComponent"),
  {
    suspense: true,
  }
);

function ReceivedPage() {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <>
            <HeadersComponent />
            <ReceivedReviewComponent user={user} reviewId={review_id} />
          </>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default ReceivedPage;

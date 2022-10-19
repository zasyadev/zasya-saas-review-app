import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import WithMe from "../../component/layout/WithMe";

const ViewReviewComponent = dynamic(
  () => import("../../component/Review/ViewReviewComponent"),
  {
    suspense: true,
  }
);

function ViewReview() {
  return (
    <SuspenceWrapper>
      <WithMe>{({ user }) => <ViewReviewComponent user={user} />}</WithMe>
    </SuspenceWrapper>
  );
}

export default ViewReview;

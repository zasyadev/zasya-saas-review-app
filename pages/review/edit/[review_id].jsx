import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import WithMe from "../../../component/layout/WithMe";

const EditReviewComponent = dynamic(
  () => import("../../../component/Review/EditReviewComponent"),
  {
    suspense: true,
  }
);

function ReviewEdit() {
  return (
    <SuspenceWrapper>
      <WithMe>{({ user }) => <EditReviewComponent user={user} />}</WithMe>
    </SuspenceWrapper>
  );
}

export default ReviewEdit;

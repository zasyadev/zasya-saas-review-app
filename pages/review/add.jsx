import dynamic from "next/dynamic";
import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import WithMe from "../../component/layout/WithMe";

const AddEditReviewComponent = dynamic(
  () => import("../../component/Review/AddEditReviewComponent"),
  {
    suspense: true,
  }
);

function ReviewAdd() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <>
            <HeadersComponent />
            <AddEditReviewComponent user={user} pageTitle="Create Review" />
          </>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default ReviewAdd;

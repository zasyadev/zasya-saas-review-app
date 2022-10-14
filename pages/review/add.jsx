import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import WithMe from "../../component/layout/WithMe";

import AddEditReviewComponent from "../../component/Review/AddEditReviewComponent";
function ReviewAdd() {
  return (
    <WithMe>
      {({ user }) => (
        <>
          <HeadersComponent />
          <AddEditReviewComponent user={user} pageTitle="Create Review" />
        </>
      )}
    </WithMe>
  );
}

export default ReviewAdd;

import React from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import WithMe from "../../component/layout/WithMe";

import AddEditReviewComponent from "../../component/Review/AddEditReviewComponent";
function ReviewAdd() {
  return (
    <WithMe>
      {({ user }) => (
        // <AdminLayout user={user} title="Create Review">
        <>
          <HeadersComponent />
          <AddEditReviewComponent user={user} pageTitle="Create Review" />
        </>
        // </AdminLayout>
      )}
    </WithMe>
  );
}

export default ReviewAdd;

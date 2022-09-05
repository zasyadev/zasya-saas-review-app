import React from "react";

import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

import AddEditReviewComponent from "../../component/Review/AddEditReviewComponent";
function ReviewAdd() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Create Review">
          <AddEditReviewComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default ReviewAdd;

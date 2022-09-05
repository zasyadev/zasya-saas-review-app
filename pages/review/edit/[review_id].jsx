import React from "react";
import WithMe from "../../../component/layout/WithMe";
import EditReviewComponent from "../../../component/Review/EditReviewComponent";

function ReviewEdit() {
  return <WithMe>{({ user }) => <EditReviewComponent user={user} />}</WithMe>;
}

export default ReviewEdit;

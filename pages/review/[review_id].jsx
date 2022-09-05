import React from "react";
import WithMe from "../../component/layout/WithMe";
import ViewReviewComponent from "../../component/Review/ViewReviewComponent";

function ViewReview() {
  return <WithMe>{({ user }) => <ViewReviewComponent user={user} />}</WithMe>;
}

export default ViewReview;

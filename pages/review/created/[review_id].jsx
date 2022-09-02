import React from "react";

import WithMe from "../../../component/layout/WithMe";
import CreateReviewComponent from "../../../component/Review/CreateReviewComponent";

function CreateReview() {
  return <WithMe>{({ user }) => <CreateReviewComponent user={user} />}</WithMe>;
}

export default CreateReview;

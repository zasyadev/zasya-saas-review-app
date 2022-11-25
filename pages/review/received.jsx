import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";

import FormView from "../../component/Form/FormView";
import WithMe from "../../component/layout/WithMe";

function ReviewReceivedPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Reviews"}>
          <FormView user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default ReviewReceivedPage;

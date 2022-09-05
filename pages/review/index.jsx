import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import ReviewManagement from "../../component/Review/ReviewManagement";

function Management() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Reviews"}>
          <ReviewManagement user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default Management;

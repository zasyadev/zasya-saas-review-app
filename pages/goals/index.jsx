import React from "react";
import GoalsList from "../../component/Goals/GoalsList";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function GoalsPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Goals"}>
          <GoalsList user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default GoalsPage;

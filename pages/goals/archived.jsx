import React from "react";
import GoalsList from "../../component/Goals/GoalsList";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function GoalsArchivedListPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Goals"}>
          <GoalsList user={user} isArchived />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default GoalsArchivedListPage;

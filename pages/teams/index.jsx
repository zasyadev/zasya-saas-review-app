import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import TeamListComponent from "../../component/Team/TeamListComponent";

function MembersPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Team"}>
          <TeamListComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default MembersPage;

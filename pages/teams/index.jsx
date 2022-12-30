import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import TeamsListComponent from "../../component/Teams/TeamsListComponent";

function MembersPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Team"}>
          <TeamsListComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default MembersPage;

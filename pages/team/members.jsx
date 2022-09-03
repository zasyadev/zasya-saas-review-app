import React from "react";

import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

import TeamMembers from "../../component/Team/TeamMembers";

function membersPage({ user }) {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Team"}>
          <TeamMembers user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default membersPage;

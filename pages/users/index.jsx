import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import UserMembers from "../../component/Users/UserMembers";

function MembersPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Users"}>
          <UserMembers user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default MembersPage;

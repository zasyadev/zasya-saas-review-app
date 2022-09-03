import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import AddTeamComponent from "../../component/Team/AddTeamComponent";

function AddTeam() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Create Team">
          <AddTeamComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default AddTeam;

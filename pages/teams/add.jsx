import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

const AddUpdateTeamMember = dynamic(
  () => import("../../component/Teams/AddUpdateTeamMember"),
  {
    suspense: true,
  }
);

function AddTeam() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title="Create Team">
            <AddUpdateTeamMember />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default AddTeam;

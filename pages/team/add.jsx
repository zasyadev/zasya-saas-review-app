import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

const AddTeamComponent = dynamic(
  () => import("../../component/Team/AddTeamComponent"),
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
            <AddTeamComponent user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default AddTeam;

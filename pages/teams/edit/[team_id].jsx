import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

const AddUpdateTeamMember = dynamic(
  () => import("../../../component/Teams/AddUpdateTeamMember"),
  {
    suspense: true,
  }
);

function EditTeam() {
  const router = useRouter();
  const { team_id } = router.query;

  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title="">
            {team_id && (
              <AddUpdateTeamMember team_id={team_id} editMode={true} />
            )}
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default EditTeam;

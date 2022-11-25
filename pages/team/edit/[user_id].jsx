import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

import httpService from "../../../lib/httpService";

const AddTeamComponent = dynamic(
  () => import("../../../component/Team/AddTeamComponent"),
  {
    suspense: true,
  }
);

function EditTeam() {
  const router = useRouter();
  const { user_id } = router.query;
  const [memberData, setMemberData] = useState({});

  async function fetchTeamData(id) {
    setMemberData([]);

    await httpService
      .post(`/api/team/edit/${id}`, {
        org_user: id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMemberData(response.data);
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setMemberData([]);
      });
  }

  useEffect(() => {
    if (user_id) fetchTeamData(user_id);
  }, [user_id]);

  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title="">
            {Object.keys(memberData).length > 0 && (
              <AddTeamComponent
                user={user}
                memberData={memberData}
                editMode={true}
              />
            )}
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default EditTeam;

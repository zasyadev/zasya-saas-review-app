import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import httpService from "../../../lib/httpService";

const AddUpdateUsers = dynamic(
  () => import("../../../component/Users/AddUpdateUsers"),
  {
    suspense: true,
  }
);

function EditUsers() {
  const router = useRouter();
  const { user_id } = router.query;
  const [memberData, setMemberData] = useState({});

  async function fetchTeamData(id) {
    setMemberData([]);

    await httpService
      .post(`/api/member/edit/${id}`, {
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
              <AddUpdateUsers
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

export default EditUsers;

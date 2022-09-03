import React, { useEffect, useState } from "react";

import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import AddTeamComponent from "../../../component/Team/AddTeamComponent";
import { useRouter } from "next/router";
import httpService from "../../../lib/httpService";

function EditTeam({ user }) {
  const router = useRouter();
  const { user_id } = router.query;
  const [memberData, setMemberData] = useState({});

  async function fetchTeamData(id) {
    setMemberData([]);

    await httpService
      .post(`/api/team/edit/${id}`, {
        org_user: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMemberData(response.data);
        }
      })
      .catch((err) => {
        console.error(err.response.data.message);
        setMemberData([]);
      });
  }

  useEffect(() => {
    if (user_id) fetchTeamData(user_id);
  }, []);

  return (
    <AdminLayout user={user} title="">
      {Object.keys(memberData).length > 0 && (
        <AddTeamComponent user={user} memberData={memberData} editMode={true} />
      )}
    </AdminLayout>
  );
}

export default EditTeam;
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}

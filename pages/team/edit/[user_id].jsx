import React, { useEffect, useState } from "react";

import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import AddTeamComponent from "../../../component/Team/AddTeamComponent";
import { useRouter } from "next/router";

function EditTeam({ user }) {
  const router = useRouter();
  const { user_id } = router.query;
  const [memberData, setMemberData] = useState({});

  async function fetchTeamData(id) {
    // setLoading(true);
    setMemberData([]);
    await fetch("/api/team/edit/" + id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setMemberData(response.data);
        }
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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

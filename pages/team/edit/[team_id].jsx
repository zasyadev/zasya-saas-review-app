import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import AddTeamComponent from "../../../component/Team/AddTeamComponent";

function EditTeam({ user }) {
  const [memberData, setMemberData] = useState({});

  return (
    <AdminLayout user={user} title="">
      <AddTeamComponent user={user} editFormData={formData} editMode={true} />
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

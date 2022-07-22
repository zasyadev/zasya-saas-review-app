import React from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";
import AddTeamComponent from "../../component/Team/AddTeamComponent";

function AddTeam({ user }) {
  return (
    <AdminLayout user={user} title="Create Team">
      <AddTeamComponent user={user} />
    </AdminLayout>
  );
}

export default AddTeam;

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

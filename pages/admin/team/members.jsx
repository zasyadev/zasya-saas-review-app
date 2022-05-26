import React, { useState } from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../../component/layout/AdminLayout";

import TeamMembers from "../../../component/Team/TeamMembers";

function membersPage({ user }) {
  return (
    <AdminLayout user={user}>
      <TeamMembers user={user} />
    </AdminLayout>
  );
}

export default membersPage;

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

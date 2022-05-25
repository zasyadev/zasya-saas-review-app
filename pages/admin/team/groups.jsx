import React, { useState } from "react";

import { getSession } from "next-auth/client";

import TeamGroups from "../../../component/Team/TeamGroups";
import AdminLayout from "../../../component/layout/AdminLayout";

function team({ user }) {
  return (
    <AdminLayout user={user}>
      <TeamGroups user={user} />
    </AdminLayout>
  );
}

export default team;

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

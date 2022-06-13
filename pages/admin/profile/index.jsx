import React, { useState } from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../../component/layout/AdminLayout";
import Profile from "../../../component/Profile/Profile";

function profilePage({ user }) {
  return (
    <AdminLayout user={user}>
      <Profile user={user} />
    </AdminLayout>
  );
}

export default profilePage;

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

import React from "react";
import { getSession } from "next-auth/react";
import AdminLayout from "../../component/layout/AdminLayout";
import AdminUsers from "../../component/Users/AdminUsers";

function userPage({ user }) {
  return (
    <AdminLayout user={user}>
      <AdminUsers user={user} />
    </AdminLayout>
  );
}

export default userPage;

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

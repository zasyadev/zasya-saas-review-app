import React from "react";
import { getSession } from "next-auth/client";
import DashBoard from "../../component/DashBoard/DashBoard";
import AdminLayout from "../../component/layout/AdminLayout";

function dashboard({ user }) {
  // const { user } = session;
  return (
    <AdminLayout user={user} title={"DashBoard"}>
      <DashBoard user={user} />
    </AdminLayout>
  );
}

export default dashboard;

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

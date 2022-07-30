import React from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";
import AllApplaud from "../../component/Applaud/AllAplaud";

function Allapplaud({ user }) {
  return (
    <AdminLayout user={user} title="View All Applaud">
      <AllApplaud user={user} />
    </AdminLayout>
  );
}

export default Allapplaud;

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

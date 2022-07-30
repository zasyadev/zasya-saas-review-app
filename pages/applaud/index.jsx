import React, { useState } from "react";
import { getSession } from "next-auth/client";
import Applaud from "../../component/Applaud/Applaud";
import AdminLayout from "../../component/layout/AdminLayout";

function Applaud({ user }) {
  return (
    <AdminLayout user={user} title={"Applaud"}>
      <Applaud user={user} />
    </AdminLayout>
  );
}

export default Applaud;

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

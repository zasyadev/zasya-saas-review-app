import React, { useState } from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../../component/layout/AdminLayout";
import FormManagement from "../../../component/Form/FormManagement";

function management({ user }) {
  return (
    <AdminLayout user={user}>
      <FormManagement user={user} />
    </AdminLayout>
  );
}

export default management;

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

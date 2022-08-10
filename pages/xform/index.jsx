import React, { useState } from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";

import FormLayout from "../../component/Form/FormLayout";

function formPage({ user }) {
  return (
    <AdminLayout user={user}>
      <FormLayout user={user} />
    </AdminLayout>
  );
}

export default formPage;

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

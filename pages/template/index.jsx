import React, { useState } from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";
import TemplateLayout from "../../component/Template/TemplateLayout";

function templatePage({ user }) {
  return (
    <AdminLayout user={user}>
      <TemplateLayout user={user} />
    </AdminLayout>
  );
}

export default templatePage;

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

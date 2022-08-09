import React, { useEffect, useState } from "react";

import AdminLayout from "../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";

import TemplateBuildComponent from "../../component/Template/TemplateBuildComponent";

function AddTemplate({ user }) {
  return (
    <AdminLayout user={user} title="Template">
      <TemplateBuildComponent user={user} />
    </AdminLayout>
  );
}

export default AddTemplate;
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

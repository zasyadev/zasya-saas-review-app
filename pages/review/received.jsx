import React, { useState } from "react";
import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";

import FormView from "../../component/Form/FormView";

function ReviewReceivedPage({ user }) {
  return (
    <AdminLayout user={user} title={"Reviews Received"}>
      <FormView user={user} />
    </AdminLayout>
  );
}

export default ReviewReceivedPage;

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

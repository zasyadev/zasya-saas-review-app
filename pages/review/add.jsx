import React, { useEffect, useState } from "react";

import AdminLayout from "../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import AddEditReviewComponent from "../../component/Review/AddEditReviewComponent";
function ReviewAdd({ user }) {
  return (
    <AdminLayout user={user} title="Create Review">
      <AddEditReviewComponent user={user} />
    </AdminLayout>
  );
}

export default ReviewAdd;

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

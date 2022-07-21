import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import ReceivedReviewComponent from "../../../component/Review/ReceivedReviewComponent";

function ReceivedPage({ user }) {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <AdminLayout user={user} title={"Review"}>
      <ReceivedReviewComponent user={user} reviewId={review_id} />
    </AdminLayout>
  );
}

export default ReceivedPage;
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
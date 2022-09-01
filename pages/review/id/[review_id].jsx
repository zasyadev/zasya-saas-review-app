import React from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import ReceivedReviewComponent from "../../../component/Review/ReceivedReviewComponent";
import { HeadersComponent } from "../../../component/common/HeadersComponent";

function ReceivedPage({ user }) {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <>
      <HeadersComponent />
      <ReceivedReviewComponent user={user} reviewId={review_id} />
    </>
  );
}

export default ReceivedPage;
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?back_url=/review/received",
        permanent: false,
      },
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}

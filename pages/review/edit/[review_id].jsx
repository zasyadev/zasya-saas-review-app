import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../component/layout/AdminLayout";
import { getSession } from "next-auth/client";
import AddEditReviewComponent from "../../../component/Review/AddEditReviewComponent";

function ReviewEdit({ user }) {
  const [reviewData, setReviewData] = useState({});

  const router = useRouter();
  const { review_id } = router.query;

  const fetchReviewData = async (review_id) => {
    setLoading(true);
    setReviewData({});
    await fetch("/api/review/edit/" + review_id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setReviewData(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (review_id) fetchReviewData(review_id);
    else return;
  }, []);

  return (
    <AdminLayout user={user} title="Template">
      <AddEditReviewComponent user={user} />
    </AdminLayout>
  );
}

export default ReviewEdit;

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

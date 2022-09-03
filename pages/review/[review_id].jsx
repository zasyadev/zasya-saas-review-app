import React from "react";

import AdminLayout from "../../component/layout/AdminLayout";
// import { getSession } from "next-auth/client";

import WithMe from "../../component/layout/WithMe";
import ViewReviewComponent from "../../component/Review/ViewReviewComponent";

function ViewReview() {
  return <WithMe>{({ user }) => <ViewReviewComponent user={user} />}</WithMe>;
}

export default ViewReview;

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   const { user } = session;
//   return {
//     props: { user },
//   };
// }

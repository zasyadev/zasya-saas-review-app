import React from "react";

import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
// import { getSession } from "next-auth/client";
import AddEditReviewComponent from "../../component/Review/AddEditReviewComponent";
function ReviewAdd() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Create Review">
          <AddEditReviewComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default ReviewAdd;

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

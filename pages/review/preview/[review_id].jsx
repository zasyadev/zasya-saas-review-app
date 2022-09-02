import React from "react";
import { useRouter } from "next/router";
// import { getSession } from "next-auth/client";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import PreviewComponent from "../../../component/Review/PreviewComponent";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

function ReceivedPage({ user }) {
  const router = useRouter();
  const { review_id } = router.query;
  return (
    <WithMe>
      {({ user }) => (
        <>
          <HeadersComponent />
          <AdminLayout user={user} title="Preview Answer">
            <PreviewComponent user={user} reviewId={review_id} />
          </AdminLayout>
        </>
      )}
    </WithMe>
  );
}

export default ReceivedPage;
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

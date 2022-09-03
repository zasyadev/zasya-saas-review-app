import React from "react";
// import { getSession } from "next-auth/client";
import DashBoard from "../../component/DashBoard/DashBoard";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function dashboard() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"DashBoard"}>
          <DashBoard user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default dashboard;

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

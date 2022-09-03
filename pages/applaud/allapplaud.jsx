import React from "react";
// import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";
import AllAplaud from "../../component/Applaud/AllAplaud";
import WithMe from "../../component/layout/WithMe";

function Allapplaud() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="View All Applaud">
          <AllAplaud user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default Allapplaud;

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

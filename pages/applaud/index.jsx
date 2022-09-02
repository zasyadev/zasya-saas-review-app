import React from "react";
// import { getSession } from "next-auth/client";
import Applaud from "../../component/Applaud/Applaud";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function ApplaudPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Applaud"}>
          <Applaud user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default ApplaudPage;

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/auth/login?back_url=/applaud",
//         permanent: false,
//       },
//     };
//   }
//   const { user } = session;
//   return {
//     props: { user },
//   };
// }

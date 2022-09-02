import React from "react";
// import { getSession } from "next-auth/client";
import AddApplaudComponent from "../../component/Applaud/AddApplaudComponent";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function Addapplaud() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Create Applaud">
          <AddApplaudComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default Addapplaud;

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

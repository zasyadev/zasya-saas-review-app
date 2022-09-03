import React from "react";
// import { getSession } from "next-auth/client";
import AdminLayout from "../../component/layout/AdminLayout";
import Profile from "../../component/Profile/Profile";
import WithMe from "../../component/layout/WithMe";

function profilePage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Profile"}>
          <Profile user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default profilePage;

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

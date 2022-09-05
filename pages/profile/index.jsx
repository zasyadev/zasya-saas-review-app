import React from "react";
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

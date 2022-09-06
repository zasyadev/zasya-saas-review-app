import React from "react";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import EditProfile from "../../../component/Profile/EditProflle";

function EditProfilePage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Edit Profile"}>
          <EditProfile user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default EditProfilePage;

import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

const AddUpdateUsers = dynamic(
  () => import("../../component/Users/AddUpdateUsers"),
  {
    suspense: true,
  }
);

function AddUsers() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title="Create User">
            <AddUpdateUsers user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default AddUsers;
